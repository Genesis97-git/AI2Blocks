# AI2Blocks

Generate MIT App Inventor blocks directly from AI-generated code.

## Overview

AI2Blocks is a Chrome extension that converts AI-generated program descriptions into native MIT App Inventor Blockly blocks.

Instead of manually recreating every block from an AI response, developers can paste the generated description and instantly build the corresponding block workspace.

## Why?

MIT App Inventor is an excellent educational platform, but creating medium and large applications with blocks can become repetitive and time-consuming.

Modern AI models can already generate application logic very well. AI2Blocks aims to bridge the gap between AI-generated logic and App Inventor's visual programming environment.

## Goals

* Convert AI-generated descriptions into Blockly blocks.
* Create blocks directly inside the App Inventor editor.
* Support common App Inventor components and events.
* Save developers and educators significant development time.

## Current Status

🚧 Early development

## Roadmap

* [x] Prove that blocks can be created programmatically from the browser console.
* [ ] Build a Chrome extension.
* [ ] Create a parser for AI-generated descriptions.
* [ ] Generate event blocks.
* [ ] Generate property blocks.
* [ ] Generate method call blocks.
* [ ] Support variables.
* [ ] Support conditions.
* [ ] Support loops.
* [ ] Support procedures.

## Project Structure

```text
docs/          Documentation and research
extension/     Chrome extension source code
examples/      Example inputs and generated blocks
```

Contributions, ideas, and feedback are welcome.
