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

function generateXmlFromAst(ast) {
  const eventNode = ast.body[0];
  const eventType = guessComponentType(eventNode.component);
  const bodyXml = chainStatements(eventNode.body);

  return `
<xml>
  <block type="component_event" x="100" y="100">
    <mutation component_type="${escapeXml(eventType)}" is_generic="false" instance_name="${escapeXml(eventNode.component)}" event_name="${escapeXml(eventNode.event)}"></mutation>
    <statement name="DO">
      ${bodyXml}
    </statement>
  </block>
</xml>`.trim();
}

function scriptToXml(scriptText) {
  const ast = parseAI2BlocksScript(scriptText);
  return generateXmlFromAst(ast);
}

function generateStatementXml(statementNode) {
  if (statementNode.type !== "SetProperty") {
    throw new Error(`Unsupported statement type: ${statementNode.type}`);
  }

  const componentType = guessComponentType(statementNode.component);

  return `
<block type="component_set_get">
  <mutation component_type="${escapeXml(componentType)}" set_or_get="set" property_name="${escapeXml(statementNode.property)}" is_generic="false" instance_name="${escapeXml(statementNode.component)}"></mutation>
  <value name="VALUE">
    <block type="text">
      <field name="TEXT">${escapeXml(statementNode.value.value)}</field>
    </block>
  </value>
</block>`.trim();
}

function chainStatements(statementNodes) {
  if (statementNodes.length === 0) {
    return "";
  }

  function build(index) {
    const current = generateStatementXml(statementNodes[index]);

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
