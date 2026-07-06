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

  return new Program([
    new ComponentEvent(
      eventMatch[1],
      eventMatch[2],
      [
        new SetProperty(
          setterMatch[1],
          setterMatch[2],
          new StringLiteral(setterMatch[3])
        )
      ]
    )
  ]);
}