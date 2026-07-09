# AI2Blocks

AI-assisted development for MIT App Inventor.

## Overview

AI2Blocks is a Chrome extension that converts AI-generated program descriptions into native MIT App Inventor Blockly blocks.

Instead of manually recreating every block from an AI response, developers can paste the generated description and instantly generate the corresponding blocks directly inside the MIT App Inventor editor.

## Why?

MIT App Inventor is an excellent educational platform, but creating medium and large applications with blocks can become repetitive and time-consuming.

Modern AI models can already generate application logic very well. AI2Blocks bridges the gap between AI-generated logic and App Inventor's visual programming environment.

## Goals

- Convert AI-generated descriptions into native Blockly blocks.
- Integrate seamlessly with the MIT App Inventor editor.
- Keep the language simple and closely aligned with App Inventor itself.
- Support the majority of MIT App Inventor blocks.
- Significantly reduce the time required to build applications from AI-generated code.

## Current Status

AI2Blocks is under active development.

### Currently supported

- ✅ Component events
- ✅ Component method calls
- ✅ Component property setters
- ✅ Component property getters
- ✅ Global variable declarations
- ✅ Global variable getters
- ✅ Global variable setters
- ✅ Automatic global variable conflict resolution
- ✅ Safe XML import into MIT App Inventor

For a complete implementation status, see **STATUS.md**.

## Example

```text
initialize global score to 0

when Button1.Click
  set global score to 10
  call Notifier1.ShowAlert("Hello")
  set Label1.Text to get global score
```

↓

Native MIT App Inventor blocks are generated directly inside the Blocks editor.

## Documentation

- **STATUS.md** — Current implementation status.
- **language.md** — AI2Blocks language specification.
- **reverse-engineering.md** — Notes on MIT App Inventor internals and Blockly reverse engineering.

## Project Structure

```text
docs/          Documentation and research
extension/     Chrome extension source code
examples/      Example scripts and generated blocks
```

## License

This project is currently under development.

## Contributing

Ideas, bug reports, reverse-engineering discoveries, and pull requests are welcome.