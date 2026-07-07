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
    body.push(parseTopLevelGroup(paragraph));
  }

  return new Program(body);
}

function parseTopLevelGroup(lines) {
  const firstLine = lines[0];
  const eventMatch = firstLine.match(/^when\s+(\w+)\.(\w+)$/);

  if (eventMatch) {
    const statements = lines.slice(1).map(parseStatement);

    return new ComponentEvent(
      eventMatch[1],
      eventMatch[2],
      statements
    );
  }

  return new StatementStack(lines.map(parseStatement));
}

function parseEvent(lines, startIndex) {
  const eventMatch = lines[startIndex].match(/^when\s+(\w+)\.(\w+)$/);

  const statements = [];
  let i = startIndex + 1;

  while (i < lines.length && !lines[i].startsWith("when ")) {
    statements.push(parseStatement(lines[i]));
    i++;
  }

  return {
    node: new ComponentEvent(
      eventMatch[1],
      eventMatch[2],
      statements
    ),
    nextIndex: i
  };
}

function parseStatement(line) {
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

function parseValue(rawValue) {
  rawValue = rawValue.trim();

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

  throw new Error(`Unsupported value: ${rawValue}`);
}