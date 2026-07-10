function generateXmlFromAst(ast) {
  return generateNode(ast);
}

function generateNode(node) {
  switch (node.type) {
    case "Program":
      return generateProgram(node);

    case "ComponentEvent":
      return generateComponentEvent(node);

    case "GetProperty":
      return generateGetProperty(node);

    case "SetProperty":
      return generateSetProperty(node);

    case "StringLiteral":
      return generateStringLiteral(node);

    case "NumberLiteral":
      return generateNumberLiteral(node);

    case "BooleanLiteral":
      return generateBooleanLiteral(node);

    case "ComponentMethodCall":
      return generateComponentMethodCall(node);

    case "StatementStack":
      return generateStatementStack(node);

    case "GlobalDeclaration":
      return generateGlobalDeclaration(node);

    case "GlobalVariableGet":
      return generateGlobalVariableGet(node);

    case "GlobalVariableSet":
      return generateGlobalVariableSet(node);

    case "BinaryExpression":
      return generateBinaryExpression(node);

    case "ComparisonExpression":
      return generateComparisonExpression(node);

    case "BooleanExpression":
      return generateBooleanExpression(node);

    case "NotExpression":
      return generateNotExpression(node);

    case "IfStatement":
      return generateIfStatement(node);

    default:
      throw new Error(`Unsupported AST node type: ${node.type}`);
  }
}

function generateProgram(node) {
  const startX = 100;
  const startY = 100;
  const verticalSpacing = 180;

  const blocksXml = node.body
    .map((childNode, index) => {
      const x = startX;
      const y = startY + index * verticalSpacing;

      return generateTopLevelNode(childNode, x, y);
    })
    .join("\n");

  return `
<xml>
  ${blocksXml}
</xml>`.trim();
}

function generateComponentEvent(node) {
  const componentType = guessComponentType(node.component);
  const bodyXml = chainStatements(node.body);

  return `
<block type="component_event">
  <mutation component_type="${escapeXml(componentType)}" is_generic="false" instance_name="${escapeXml(node.component)}" event_name="${escapeXml(node.event)}"></mutation>
  <statement name="DO">
    ${bodyXml}
  </statement>
</block>`.trim();
}

function generateComponentMethodCall(node) {
  const componentType = guessComponentType(node.component);

  const argsXml = node.args
    .map((arg, index) => `
  <value name="ARG${index}">
    ${generateNode(arg)}
  </value>`)
    .join("");

  return `
<block type="component_method">
  <mutation component_type="${escapeXml(componentType)}" method_name="${escapeXml(node.method)}" is_generic="false" instance_name="${escapeXml(node.component)}"></mutation>
  <field name="COMPONENT_SELECTOR">${escapeXml(node.component)}</field>${argsXml}
</block>`.trim();
}

function generateGetProperty(node) {
  const componentType = guessComponentType(node.component);

  return `
<block type="component_set_get">
  <mutation component_type="${escapeXml(componentType)}" set_or_get="get" property_name="${escapeXml(node.property)}" is_generic="false" instance_name="${escapeXml(node.component)}"></mutation>
  <field name="COMPONENT_SELECTOR">${escapeXml(node.component)}</field>
  <field name="PROP">${escapeXml(node.property)}</field>
</block>`.trim();
}

function generateSetProperty(node) {
  const componentType = guessComponentType(node.component);

  return `
<block type="component_set_get">
  <mutation component_type="${escapeXml(componentType)}" set_or_get="set" property_name="${escapeXml(node.property)}" is_generic="false" instance_name="${escapeXml(node.component)}"></mutation>
  <value name="VALUE">
    ${generateNode(node.value)}
  </value>
</block>`.trim();
}

function generateGlobalDeclaration(node) {
  return `
<block type="global_declaration">
  <field name="NAME">${escapeXml(node.name)}</field>
  <value name="VALUE">
    ${generateNode(node.value)}
  </value>
</block>`.trim();
}

function generateGlobalVariableGet(node) {
  return `
<block type="lexical_variable_get">
  <field name="VAR">global ${escapeXml(node.name)}</field>
</block>`.trim();
}

function generateGlobalVariableSet(node) {
  return `
<block type="lexical_variable_set">
  <field name="VAR">global ${escapeXml(node.name)}</field>
  <value name="VALUE">
    ${generateNode(node.value)}
  </value>
</block>`.trim();
}

function generateStringLiteral(node) {
  return `
<block type="text">
  <field name="TEXT">${escapeXml(node.value)}</field>
</block>`.trim();
}

function generateNumberLiteral(node) {
  return `
<block type="math_number">
  <field name="NUM">${escapeXml(node.value)}</field>
</block>`.trim();
}

function generateBooleanLiteral(node) {
  return `
<block type="logic_boolean">
  <field name="BOOL">${node.value ? "TRUE" : "FALSE"}</field>
</block>`.trim();
}

function generateBooleanExpression(node) {
  const blockType = node.operator === "and"
    ? "logic_operation"
    : "logic_or";

  const op = node.operator === "and"
    ? "AND"
    : "OR";

  return `
<block type="${blockType}">
  <mutation items="2"></mutation>
  <field name="OP">${op}</field>
  <value name="A">
    ${generateNode(node.left)}
  </value>
  <value name="B">
    ${generateNode(node.right)}
  </value>
</block>`.trim();
}

function generateNotExpression(node) {
  return `
<block type="logic_negate">
  <value name="BOOL">
    ${generateNode(node.value)}
  </value>
</block>`.trim();
}

function generateBinaryExpression(node) {
  if (node.operator === "+" || node.operator === "*") {
    const blockType = node.operator === "+"
      ? "math_add"
      : "math_multiply";

    return `
<block type="${blockType}">
  <mutation items="2"></mutation>
  <value name="NUM0">
    ${generateNode(node.left)}
  </value>
  <value name="NUM1">
    ${generateNode(node.right)}
  </value>
</block>`.trim();
  }

  if (node.operator === "-" || node.operator === "/") {
    const blockType = node.operator === "-"
      ? "math_subtract"
      : "math_division";

    return `
<block type="${blockType}">
  <value name="A">
    ${generateNode(node.left)}
  </value>
  <value name="B">
    ${generateNode(node.right)}
  </value>
</block>`.trim();
  }

  throw new Error(`Unsupported binary operator: ${node.operator}`);
}

function generateComparisonExpression(node) {
  const opMap = {
    "=": "EQ",
    "<": "LT",
    ">": "GT",
    "!=": "NEQ",
    "<=": "LTE",
    ">=": "GTE"
  };

  const op = opMap[node.operator];

  if (!op) {
    throw new Error(`Unsupported comparison operator: ${node.operator}`);
  }

  return `
<block type="math_compare">
  <field name="OP">${op}</field>
  <value name="A">
    ${generateNode(node.left)}
  </value>
  <value name="B">
    ${generateNode(node.right)}
  </value>
</block>`.trim();
}

function generateIfStatement(node) {
  const bodyXml = chainStatements(node.body);

  return `
<block type="controls_if">
  <value name="IF0">
    ${generateNode(node.condition)}
  </value>
  <statement name="DO0">
    ${bodyXml}
  </statement>
</block>`.trim();
}

function generateStatementStack(node) {
  return chainStatements(node.statements);
}


function chainStatements(statementNodes) {
  if (statementNodes.length === 0) {
    return "";
  }

  function build(index) {
    const current = generateNode(statementNodes[index]);

    if (index === statementNodes.length - 1) {
      return current;
    }

    const nextXml = build(index + 1);

    return current.replace(
      /<\/block>\s*$/,
      `<next>${nextXml}</next></block>`
    );
  }

  return build(0);
}

function generateTopLevelNode(node, x, y) {
  const xml = generateNode(node);

  return xml.replace(
    /^<block /,
    `<block x="${x}" y="${y}" `
  );
}

function chainTopLevelNodes(nodes) {
  if (nodes.length === 0) {
    return "";
  }

  const groups = [];
  let currentStatementGroup = [];

  for (const node of nodes) {
    if (node.type === "SetProperty" || node.type === "ComponentMethodCall") {
      currentStatementGroup.push(node);
      continue;
    }

    if (currentStatementGroup.length > 0) {
      groups.push(chainStatements(currentStatementGroup));
      currentStatementGroup = [];
    }

    groups.push(generateNode(node));
  }

  if (currentStatementGroup.length > 0) {
    groups.push(chainStatements(currentStatementGroup));
  }

  return groups.join("\n");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function guessComponentType(instanceName) {
  return instanceName.replace(/\d+$/, "");
}

function scriptToXml(scriptText) {
  const ast = parseAI2BlocksScript(scriptText);
  return generateXmlFromAst(ast);
}