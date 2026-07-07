function parseAI2BlocksScript(scriptText) {
  const lines = scriptText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const eventMatch = lines[0]?.match(/^when\s+(\w+)\.(\w+)$/);

  if (!eventMatch) {
    throw new Error('First line must be: when Button1.Click');
  }

  const statements = [];

  for (let i = 1; i < lines.length; i++) {
    const setterMatch = lines[i].match(/^set\s+(\w+)\.(\w+)\s+to\s+"(.*)"$/);

    if (!setterMatch) {
      throw new Error(`Unsupported line: ${lines[i]}`);
    }

    statements.push(
      new SetProperty(
        setterMatch[1],
        setterMatch[2],
        new StringLiteral(setterMatch[3])
      )
    );
  }

  return new Program([
    new ComponentEvent(
      eventMatch[1],
      eventMatch[2],
      statements
    )
  ]);
}