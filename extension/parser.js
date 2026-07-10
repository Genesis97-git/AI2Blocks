function parseAI2BlocksScript(scriptText) {
  const paragraphs = scriptText
    .split(/\n\s*\n/)
    .map(paragraph =>
      paragraph
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
    )
    .filter(paragraph => paragraph.length > 0);

  const body = [];

  for (const paragraph of paragraphs) {
    body.push(...parseTopLevelGroup(paragraph));
  }

  return new Program(body);
}

function parseTopLevelGroup(lines) {
  const nodes = [];
  let currentStack = [];

  function flushCurrentStack() {
  if (currentStack.length === 0) {
    return;
  }

  const firstLine = currentStack[0];
  const eventMatch = firstLine.match(/^when\s+(\w+)\.(\w+)$/);

  if (eventMatch) {
    const result = parseStatementSequence(
      currentStack.slice(1)
    );

    nodes.push(
      new ComponentEvent(
        eventMatch[1],
        eventMatch[2],
        result.statements
      )
    );
  } else {
    const result = parseStatementSequence(currentStack);

    nodes.push(
      new StatementStack(result.statements)
    );
  }

  currentStack = [];
  }

  for (const line of lines) {
    const globalDeclarationMatch = line.match(
      /^initialize\s+global\s+(\w+)\s+to\s+(.+)$/
    );

    if (globalDeclarationMatch) {
      flushCurrentStack();
      nodes.push(parseGlobalDeclaration(line));
      continue;
    }

    currentStack.push(line);
  }

  flushCurrentStack();

  return nodes;
}

function parseGlobalDeclaration(line) {
  const match = line.match(/^initialize\s+global\s+(\w+)\s+to\s+(.+)$/);

  if (!match) {
    throw new Error(`Invalid global declaration: ${line}`);
  }

  return new GlobalDeclaration(
    match[1],
    parseValue(match[2])
  );
}

function parseStatement(line) {
  const globalSetMatch = line.match(/^set\s+global\s+(\w+)\s+to\s+(.+)$/);

  if (globalSetMatch) {
    return new GlobalVariableSet(
      globalSetMatch[1],
      parseValue(globalSetMatch[2])
    );
  }

  const setterMatch = line.match(/^set\s+(\w+)\.(\w+)\s+to\s+(.+)$/);

  if (setterMatch) {
    return new SetProperty(
      setterMatch[1],
      setterMatch[2],
      parseValue(setterMatch[3])
    );
  }

  const methodMatch = line.match(/^call\s+(\w+)\.(\w+)\((.*)\)$/);

  if (methodMatch) {
    const rawArgs = methodMatch[3].trim();

    const args = rawArgs
      ? rawArgs.split(",").map(arg => parseValue(arg.trim()))
      : [];

    return new ComponentMethodCall(
      methodMatch[1],
      methodMatch[2],
      args
    );
  }

  throw new Error(`Unsupported statement: ${line}`);
}

function parseIfStatement(lines, startIndex) {
  const line = lines[startIndex];

  const hasParenthesizedBody = line.endsWith("(");

  const conditionText = hasParenthesizedBody
    ? line.slice(2, -1).trim()
    : line.slice(2).trim();

  if (!conditionText) {
    throw new Error(`Missing condition in: ${line}`);
  }

  const condition = parseValue(conditionText);

  if (hasParenthesizedBody) {
    const bodyResult = parseStatementSequence(
      lines,
      startIndex + 1,
      true
    );

    return {
      node: new IfStatement(condition, bodyResult.statements),
      nextIndex: bodyResult.nextIndex
    };
  }

  const nextIndex = startIndex + 1;

  if (nextIndex >= lines.length || lines[nextIndex] === ")") {
    throw new Error(`If statement has no body: ${line}`);
  }

  let bodyNode;

  if (/^if\s+/.test(lines[nextIndex])) {
    const nestedResult = parseIfStatement(lines, nextIndex);
    bodyNode = nestedResult.node;

    return {
      node: new IfStatement(condition, [bodyNode]),
      nextIndex: nestedResult.nextIndex
    };
  }

  bodyNode = parseStatement(lines[nextIndex]);

  return {
    node: new IfStatement(condition, [bodyNode]),
    nextIndex: nextIndex + 1
  };
}

function parseStatementSequence(lines, startIndex = 0, stopAtClosingParen = false) {
  const statements = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];

    if (line === ")") {
      if (!stopAtClosingParen) {
        throw new Error("Unexpected closing parenthesis.");
      }

      return {
        statements,
        nextIndex: i + 1
      };
    }

    if (/^if\s+/.test(line)) {
      const result = parseIfStatement(lines, i);
      statements.push(result.node);
      i = result.nextIndex;
      continue;
    }

    statements.push(parseStatement(line));
    i++;
  }

  if (stopAtClosingParen) {
    throw new Error("Missing closing parenthesis for statement body.");
  }

  return {
    statements,
    nextIndex: i
  };
}

function parseValue(rawValue) {
  rawValue = rawValue.trim();

  const notMatch = rawValue.match(/^not\s+(.+)$/);

  if (notMatch) {
    return new NotExpression(parseValue(notMatch[1]));
  }

  const booleanMatch = rawValue.match(/^(.+?)\s+(and|or)\s+(.+)$/);

  if (booleanMatch) {
    return new BooleanExpression(
      booleanMatch[2],
      parseValue(booleanMatch[1]),
      parseValue(booleanMatch[3])
    );
  }

  const comparisonMatch = rawValue.match(
    /^(.+?)\s*(>=|<=|!=|<>|==|=|>|<)\s*(.+)$/
  );

  if (comparisonMatch) {
    const aliases = {
      "==": "=",
      "<>": "!="
    };

    const operator = aliases[comparisonMatch[2]] ?? comparisonMatch[2];

    return new ComparisonExpression(
      operator,
      parseValue(comparisonMatch[1]),
      parseValue(comparisonMatch[3])
    );
  }

  const binaryMatch = rawValue.match(/^(.+)\s*([+\-*/])\s*(.+)$/);

  if (binaryMatch) {
    return new BinaryExpression(
      binaryMatch[2],
      parseValue(binaryMatch[1]),
      parseValue(binaryMatch[3])
    );
  }

  if (/^".*"$/.test(rawValue)) {
    return new StringLiteral(rawValue.slice(1, -1));
  }

  if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
    return new NumberLiteral(rawValue);
  }

  if (rawValue === "true" || rawValue === "false") {
    return new BooleanLiteral(rawValue);
  }

  const getterMatch = rawValue.match(/^(\w+)\.(\w+)$/);

  if (getterMatch) {
    return new GetProperty(
      getterMatch[1],
      getterMatch[2]
    );
  }

  const globalGetMatch = rawValue.match(/^get\s+global\s+(\w+)$/);

  if (globalGetMatch) {
    return new GlobalVariableGet(globalGetMatch[1]);
  }

  throw new Error(`Unsupported value: ${rawValue}`);
}