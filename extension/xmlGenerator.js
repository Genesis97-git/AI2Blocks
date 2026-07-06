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
  const statementNode = eventNode.body[0];

  const eventType = guessComponentType(eventNode.component);
  const setterType = guessComponentType(statementNode.component);

  return `
<xml>
  <block type="component_event" x="100" y="100">
    <mutation component_type="${escapeXml(eventType)}" is_generic="false" instance_name="${escapeXml(eventNode.component)}" event_name="${escapeXml(eventNode.event)}"></mutation>
    <statement name="DO">
      <block type="component_set_get">
        <mutation component_type="${escapeXml(setterType)}" set_or_get="set" property_name="${escapeXml(statementNode.property)}" is_generic="false" instance_name="${escapeXml(statementNode.component)}"></mutation>
        <value name="VALUE">
          <block type="text">
            <field name="TEXT">${escapeXml(statementNode.value.value)}</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`.trim();
}

function scriptToXml(scriptText) {
  const ast = parseAI2BlocksScript(scriptText);
  return generateXmlFromAst(ast);
}