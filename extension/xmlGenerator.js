function generateXmlFromAst(ast) {
  return generateNode(ast);
}

function generateNode(node) {
  switch (node.type) {
    case "Program":
      return generateProgram(node);

    case "ComponentEvent":
      return generateComponentEvent(node);

    case "SetProperty":
      return generateSetProperty(node);

    case "StringLiteral":
      return generateStringLiteral(node);

    case "NumberLiteral":
      return generateNumberLiteral(node);

    case "BooleanLiteral":
      return generateBooleanLiteral(node);

    default:
      throw new Error(`Unsupported AST node type: ${node.type}`);
  }
}

function generateProgram(node) {
  return `
<xml>
  ${node.body.map(generateNode).join("\n")}
</xml>`.trim();
}

function generateComponentEvent(node) {
  const componentType = guessComponentType(node.component);
  const bodyXml = chainStatements(node.body);

  return `
<block type="component_event" x="100" y="100">
  <mutation component_type="${escapeXml(componentType)}" is_generic="false" instance_name="${escapeXml(node.component)}" event_name="${escapeXml(node.event)}"></mutation>
  <statement name="DO">
    ${bodyXml}
  </statement>
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