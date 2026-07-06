function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseSimpleScript(scriptText) {
  const lines = scriptText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const eventMatch = lines[0]?.match(/^when\s+(\w+)\.(\w+)$/);
  const setterMatch = lines[1]?.match(/^set\s+(\w+)\.(\w+)\s+to\s+"(.+)"$/);

  if (!eventMatch || !setterMatch) {
    throw new Error("Supported format: when Button1.Click / set Label1.Text to \"Hello\"");
  }

  return {
    eventComponent: eventMatch[1],
    eventName: eventMatch[2],
    setComponent: setterMatch[1],
    propertyName: setterMatch[2],
    value: setterMatch[3]
  };
}

function guessComponentType(instanceName) {
  return instanceName.replace(/\d+$/, "");
}

function generateHelloXml(parsed) {
  const eventType = guessComponentType(parsed.eventComponent);
  const setterType = guessComponentType(parsed.setComponent);

  return `
<xml>
  <block type="component_event" x="100" y="100">
    <mutation component_type="${escapeXml(eventType)}" is_generic="false" instance_name="${escapeXml(parsed.eventComponent)}" event_name="${escapeXml(parsed.eventName)}"></mutation>
    <statement name="DO">
      <block type="component_set_get">
        <mutation component_type="${escapeXml(setterType)}" set_or_get="set" property_name="${escapeXml(parsed.propertyName)}" is_generic="false" instance_name="${escapeXml(parsed.setComponent)}"></mutation>
        <value name="VALUE">
          <block type="text">
            <field name="TEXT">${escapeXml(parsed.value)}</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`.trim();
}

function scriptToXml(scriptText) {
  return generateHelloXml(parseSimpleScript(scriptText));
}