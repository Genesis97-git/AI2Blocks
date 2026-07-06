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
