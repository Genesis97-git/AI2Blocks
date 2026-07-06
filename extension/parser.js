function parseAI2BlocksScript(scriptText) {
  const lines = scriptText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const eventMatch = lines[0]?.match(/^when\s+(\w+)\.(\w+)$/);
  const setterMatch = lines[1]?.match(/^set\s+(\w+)\.(\w+)\s+to\s+"(.+)"$/);

  if (!eventMatch || !setterMatch) {
    throw new Error('Supported format: when Button1.Click / set Label1.Text to "Hello"');
  }

  return {
    type: "Program",
    body: [
      {
        type: "ComponentEvent",
        component: eventMatch[1],
        event: eventMatch[2],
        body: [
          {
            type: "SetProperty",
            component: setterMatch[1],
            property: setterMatch[2],
            value: {
              type: "StringLiteral",
              value: setterMatch[3]
            }
          }
        ]
      }
    ]
  };
}