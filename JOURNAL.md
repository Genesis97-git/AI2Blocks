# Development Journal

---

## 2026-07-05

### Initial Idea

As a teacher, creating applications entirely with MIT App Inventor blocks takes a significant amount of time. Since modern AI can already generate application logic, I began exploring whether that logic could be converted directly into App Inventor blocks.

The goal of AI2Blocks is to eliminate manual block creation by automatically generating Blockly blocks from AI-generated descriptions.

### Research

* Investigated the internal Blockly implementation used by MIT App Inventor.
* Explored the editor through the browser developer tools.
* Experimented with creating blocks programmatically.

### Discoveries

* Successfully created blocks directly from the browser console.
* Confirmed that App Inventor exposes enough internal functionality to make automatic block generation technically possible.

### Next Steps

* Build the first Chrome extension prototype.
* Move the console experiments into reusable JavaScript functions.
* Design the first parser for AI-generated descriptions.


## 2026-07-06

### Goal

Transform yesterday's proof of concept into the foundation of a real Chrome extension capable of generating MIT App Inventor blocks from textual descriptions.

### Major Accomplishments

* Created the **AI2Blocks** GitHub repository and established the initial project structure.
* Added project documentation, including the README, development journal, ideas list, and reverse-engineering notes.
* Built the first working version of the Chrome extension.
* Implemented communication between the extension popup and the MIT App Inventor page.
* Successfully injected JavaScript into the App Inventor editor from the extension.

### Reverse Engineering

Investigated the internal Blockly implementation used by MIT App Inventor.

Key discoveries:

* Accessed the main Blockly workspace through `Blockly.getMainWorkspace()`.
* Confirmed that blocks can be created programmatically.
* Determined that App Inventor uses custom Blockly mutations to configure component blocks.
* Reverse-engineered the XML structure for:
  * Component event blocks (`component_event`)
  * Property setter blocks (`component_set_get`)
* Identified the `VALUE` input used by property setter blocks.
* Determined that App Inventor does not expose `Blockly.Xml.textToDom()`, but importing XML using `DOMParser` together with `Blockly.Xml.domToWorkspace()` works correctly.

### First Generated Programs

Successfully generated:

* A standalone `when Button1.Click` event block.
* A standalone `set Label1.Text` property setter.
* A complete working program:

```text
when Button1.Click
    set Label1.Text to "Hello AI2Blocks!"
```

### Extension Features

Implemented:

* Blockly XML import through the extension.
* XML file loading from disk.
* XML paste support.
* Automatic detection between AI2Blocks script and Blockly XML input.

### Compiler Architecture

Refactored the project into separate stages:

```text
AI2Blocks Script
        ↓
Parser
        ↓
AST
        ↓
Blockly XML Generator
        ↓
MIT App Inventor Importer
```

Separated responsibilities into dedicated modules:

* Parser
* AST
* XML Generator
* Importer

This architecture should make future support for loops, variables, procedures, conditions, and additional components significantly easier.

### Reflection

Today's work transformed AI2Blocks from an idea into a functioning proof of concept.

At the beginning of the day, the goal was simply to create a Chrome extension capable of interacting with MIT App Inventor.

By the end of the session, AI2Blocks was able to parse a simple textual program, generate the corresponding Blockly XML, and automatically create working App Inventor blocks inside the editor.

This validates the core concept of the project and provides a solid architectural foundation for future development.

### Unexpected Realization

While implementing Blockly XML import, I realized that AI2Blocks has applications beyond converting AI-generated scripts into App Inventor blocks.

Since the extension can now import arbitrary Blockly XML directly into the editor, it can also function as an unlimited, locally stored, Git-friendly alternative to the built-in App Inventor Backpack.

Instead of relying on the Backpack, developers could maintain a library of reusable templates, snippets, and boilerplates on their computer and insert them into any project with a single click.

Possible examples include:

* Login screens
* Canvas painting systems
* Bluetooth initialization
* Firebase setup
* TinyDB helper procedures
* Common UI layouts
* Frequently used event handlers

Because these templates are stored as regular files, they can be organized into folders, version-controlled with Git, shared through GitHub, and collaboratively improved by the community.

This realization expanded the scope of AI2Blocks. Rather than being only an AI-to-Blockly converter, the project has the potential to become a general-purpose productivity toolkit for MIT App Inventor development, with AI-powered code generation as one of its core features.

## Media

- [x] Hello AI2Blocks
- [x] First working generated app
- [ ] First variables demo
- [ ] First expressions demo
- [ ] First complete generated app
- [ ] First Designer generation
- [ ] First AI conversation demo
- [ ] First public release demo