# Ideas

## Features

* Direct block generation inside MIT App Inventor
* Import AI conversations
* Prompt templates
* Automatic block layout
* Block formatter
* Undo generated blocks
* Live preview before generation
* Export generated XML
* Generate procedures automatically
* Generate comments
* Smart variable naming

## AI Support

* ChatGPT
* Gemini
* Claude
* Local LLMs

## Long-term Vision

* Support additional Blockly-based platforms.
* Create a reusable Blockly generation library.
* Provide an API for third-party integrations.
* Build an open-source ecosystem around AI-assisted visual programming.

## Template Library

Store reusable Blockly XML templates locally.

Examples:

- Login screen
- Navigation drawer
- Color picker
- Canvas paint app
- Sprite movement
- Firebase initialization
- Bluetooth connection
- TinyDB helpers
- Permission request
- Camera import

Templates can be inserted into the current project with one click.

## Full App Generation

Combine AI2Blocks with the Component Creator extension (or implement equivalent functionality directly in AI2Blocks) to enable complete MIT App Inventor application generation.

### Vision

Generate an entire application from a single AI prompt:

```text
AI Prompt
        ↓
Screen & Component Layout (Designer)
        ↓
Blockly Logic (Blocks)
        ↓
Complete App Inventor Project
```

### Possible Approaches

* Integrate with the existing Component Creator extension.
* Reimplement Designer generation directly inside AI2Blocks.
* Automatically create screens, components, properties, and layouts before generating Blockly logic.

### Benefits

* One-click application generation.
* Eliminates manual work in both the Designer and Blocks editors.
* Enables rapid prototyping and template-based project creation.
* Provides a foundation for fully AI-assisted App Inventor development.

### Reference

Component Creator extension:

[https://wangsk789.github.io/compcreator/](https://wangsk789.github.io/compcreator/)
