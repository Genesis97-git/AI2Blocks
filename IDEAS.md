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


## Text-Based Block Creation

Allow users to create App Inventor blocks by typing block names, properties, and values directly instead of searching through the Blocks palette.

### Example

```text
set Label1.Visible to true
set Label1.Height to 50
set Label1.Width to 125
set Label1.FontSize to 60
set Label1.TextColor to red
set Label1.Text to "This is a test message"
```

## Block Placement

Improve automatic placement of generated top-level block stacks.

Current approach uses fixed vertical spacing between generated stacks. This works for simple examples but can cause overlap when stacks have different heights.

Future improvements:

- Estimate stack height based on number and type of generated blocks.
- Place disconnected stacks vertically in the same order as the source text.
- Add horizontal spacing for separate groups if needed.
- Avoid overlapping existing blocks in the workspace.
- Optionally place generated blocks near the current viewport or mouse position.
- Eventually use actual rendered block dimensions after import for smarter layout.

## Export Blocks as Templates

Allow users to save blocks from the current App Inventor workspace as reusable XML templates.

### Export Options

- Export selected block only
- Export selected block stack
- Export all blocks in the workspace
- Download exported blocks as `.xml`
- Save exported templates into a local template library

### Use Cases

- Create reusable personal block snippets
- Build an unlimited local Backpack replacement
- Share templates through GitHub
- Create examples for testing AI2Blocks
- Quickly reverse-engineer new block types

### Future Workflow

```text
Select blocks in App Inventor
        ↓
Click "Export as Template"
        ↓
Download XML file
        ↓
Reuse later with AI2Blocks XML loader
```

## No-DevTools Reverse Engineering

Avoid requiring users or contributors to open the browser console.

### Goal

Move reverse-engineering tools directly into the AI2Blocks extension UI.

### Features

- Inspect selected block from the extension popup.
- Display inspection JSON directly in the popup.
- Copy inspection JSON to clipboard from the popup.
- Download inspection result as `.json`.
- Export selected block or stack as Blockly XML.
- Export all workspace blocks as Blockly XML.
- Download exported XML as reusable templates.

### Multiple Selection Inspection

If multiple blocks are selected:

- Block inspection should inspect each selected block independently.
- Stack inspection should inspect each selected block's root stack, avoiding duplicates.
- Workspace inspection should inspect/export the entire workspace.

### Reason

The extension popup has user focus, so clipboard actions should work more reliably there than from injected page scripts.

This also makes AI2Blocks easier for non-technical users and contributors, since they will not need to use F12 DevTools.

## Global Variable Name Safety

Before importing generated blocks, AI2Blocks should detect whether a script declares a global variable that already exists in the current workspace.

If a duplicate global variable name is found, the extension should warn the user instead of relying on App Inventor's automatic renaming behavior.

Reason:

App Inventor may rename a duplicate declaration, for example `score` → `score2`, but generated getter/setter blocks may still reference `global score`, causing confusing mismatches.

## Full App Generation

Goal: generate both App Inventor Designer components and Blocks from one AI-generated description.

Current status:
- Blocks generation: started and working
- Designer generation: not implemented yet

Milestone:
Idea → component tree → blocks → ready App Inventor project

## Edit Existing Blocks

Allow AI2Blocks to modify blocks that were already generated or already exist in the workspace.

### Use Case

AI generates an app. The user imports it, tests it, notices a mistake, and asks AI for a correction. Instead of manually deleting and recreating blocks, the user can paste an edit instruction into AI2Blocks.

### Possible Syntax

```text
edit selected
replace with
set Label1.Text to "Corrected text"
```

### Possible Strategies
- Replace currently selected block or stack.
- Replace a matching event block, such as when Button1.Click.
- Track generated blocks with AI2Blocks metadata IDs.
- Delete old generated blocks before inserting corrected blocks.

### Notes
This should be implemented later, after block export/import and selection tools are more mature.

## Symbol-Free Syntax Mode

Consider adding an optional mode that allows users to write AI2Blocks code without programming symbols.

### Goal

Make AI2Blocks easier for beginners, younger students, or users uncomfortable with symbolic operators.

### Examples

```text
get global score is greater than 10
```

## Flow-First Design

AI2Blocks should preserve the user's flow.

Whenever possible, users should remain focused on expressing their intent instead of manipulating the workspace.

Features should prioritize:

- Continuous typing
- Minimal mouse usage
- Minimal modifier-key usage
- Minimal dragging
- Minimal clicking
- Minimal context switching
- Fast autocomplete
- Context-aware suggestions
- Keyboard-driven editing

The user should spend more time thinking about the application and less time operating the editor.

## Full Project Generation

### Goal

Extend AI2Blocks beyond block generation to support complete MIT App Inventor project generation.

Instead of generating only Blockly blocks, AI2Blocks should eventually be capable of generating an entire application ready to import into MIT App Inventor.

---

### Future Workflow

```text
Idea
        ↓
AI
        ↓
Generate AI2Blocks Project
        ↓
Review / Edit
        ↓
Package
        ↓
.aia
        ↓
Import into MIT App Inventor
```

The review step allows the user to inspect and modify generated files before packaging the final application.

This keeps the workflow transparent while preserving the flexibility of AI-assisted development.

---

### Future Project Structure

An AI2Blocks application may eventually contain:

- Designer definition
- Blocks
- Assets (images, sounds, etc.)
- Project metadata
- Documentation

Example:

```text
CounterApp/
├── app.ai2
├── assets/
│   ├── icon.png
│   └── click.wav
├── screenshots/
│   └── preview.png
└── README.md
```

---

### Possible Outputs

AI2Blocks should support multiple output formats generated from the same AI2Blocks source.

- Chrome extension (inject into an existing project)
- Blockly XML
- Complete `.aia` project
- Future export formats

---

### Architecture

The parser and AST should remain independent of the output format.

```text
AI2Blocks Language
        ↓
Parser
        ↓
AST
       ├── Blockly Generator
       ├── Designer Generator
       ├── XML Generator
       └── AIA Generator
```

---

### Design Principle

The Chrome extension is the first frontend of AI2Blocks, not necessarily the final product.

The AI2Blocks language and compiler should remain independent of any particular frontend, allowing future tools to share the same parser and generators.

---

### Notes

MIT App Inventor `.aia` files are ZIP archives containing project metadata, Designer files, Blockly files, and assets.

AI2Blocks should investigate generating complete `.aia` projects once the language is sufficiently mature.

# Smart Editor

## Syntax Highlighting

Color code AI2Blocks according to the recognized App Inventor block category.

Examples:

- Events
- Variables
- Control Flow
- Logic
- Math
- Components
- Properties
- Text

## Semantic Highlighting

Highlight recognized project elements.

Examples:

- Existing components
- Existing properties
- Existing globals
- Existing procedures

Unknown identifiers should be highlighted immediately.

## Project Awareness

The editor should understand the currently opened App Inventor project.

Features:

- Existing components
- Existing globals
- Existing procedures
- Existing media assets

Suggestions should depend on the current project.

## Autocomplete

Minimize typing.

Examples:

score
→ get global score

Lab
→ Label1

ShowAl
→ ShowAlert

## Live Diagnostics

Display parser and semantic errors while typing.

Examples:

- Unknown component
- Unknown property
- Unknown method
- Unknown variable
- Invalid syntax

## Smart Suggestions

When the parser recognizes likely user intent, offer automatic fixes.

Examples:

score
→ get global score

<>
→ !=

Label.Text
→ Label1.Text

