# Reverse Engineering Notes

This document records discoveries about MIT App Inventor's internal Blockly usage.

---

## Workspace Access

The main Blockly workspace is available from the browser console:

```js
const ws = Blockly.getMainWorkspace();
```

Confirmed:

```js
typeof Blockly
// "object"

typeof Blockly.getMainWorkspace
// "function"

typeof Blockly.getMainWorkspace().newBlock
// "function"

Object.keys(Blockly.Blocks).length
// 201
```

---

## Basic Block Creation

A basic Blockly block can be created with:

```js
const ws = Blockly.getMainWorkspace();

const block = ws.newBlock("text");
block.initSvg();
block.render();
block.moveBy(100, 100);
```

This successfully creates a visible text block in the App Inventor Blocks editor.

---

## Component Event Block

Example inspected block:

```text
when Button1.Click
```

## Loading XML into Workspace

App Inventor's Blockly build does not expose the standard `Blockly.Xml.textToDom()` function.

Instead, use the browser `DOMParser`:

```js
const ws = Blockly.getMainWorkspace();

const xmlText = `
<xml>
  <block type="component_event" x="100" y="100">
    <mutation
      component_type="Button"
      is_generic="false"
      instance_name="Button1"
      event_name="Click">
    </mutation>
  </block>
</xml>
`;

const xml = new DOMParser().parseFromString(xmlText, "text/xml").documentElement;

Blockly.Xml.domToWorkspace(xml, ws);
```
This successfully creates:

```text
when Button1.Click
```

For a single block, this also works:

```js
const blockXml = new DOMParser().parseFromString(xmlText, "text/xml").documentElement;
Blockly.Xml.domToBlock(blockXml, ws);
```

## Property Setter Block

Example:

```text
set Label1.Text to "Hello"
```

Block type:
```text
component_set_get
```
Mutation:
```js
<mutation
  component_type="Label"
  set_or_get="set"
  property_name="Text"
  is_generic="false"
  instance_name="Label1">
</mutation>
```
The value input is named:
```text
VALUE
```
Text literal block:
```js
<block type="text">
  <field name="TEXT">Hello</field>
</block>
```
Full setter XML:
```js
<block type="component_set_get" x="100" y="220">
  <mutation
    component_type="Label"
    set_or_get="set"
    property_name="Text"
    is_generic="false"
    instance_name="Label1">
  </mutation>
  <value name="VALUE">
    <block type="text">
      <field name="TEXT">Hello</field>
    </block>
  </value>
</block>
```

### Block Type

```js
b.type
// "component_event"
```

### Important Properties

```js
b.blockType
// "event"

b.category
// "Component"

b.typeName
// "Button"

b.instanceName
// "Button1"

b.eventName
// "Click"

b.getFieldValue("COMPONENT_SELECTOR")
// "Button1"
```

### Mutation

```js
b.mutationToDom()
```

Produces:

```xml
<mutation
  component_type="Button"
  is_generic="false"
  instance_name="Button1"
  event_name="Click">
</mutation>
```

This suggests that App Inventor component event blocks are configured mainly through mutation XML.

### Inputs

```js
b.inputList
```

Observed inputs:

```text
WHENTITLE
DO
```

`WHENTITLE` contains the event title and component selector.

`DO` is the statement input where nested blocks are attached.

---

## Current Hypothesis

To generate a component event block programmatically:

1. Create a block of type `component_event`.
2. Apply a mutation with:

   * `component_type`
   * `is_generic`
   * `instance_name`
   * `event_name`
3. Initialize SVG.
4. Render the block.
5. Move it to a visible location.

Expected mutation example:

```xml
<mutation component_type="Button" is_generic="false" instance_name="Button1" event_name="Click"></mutation>
```

---

## Next Experiments

* Create `component_event` manually from JavaScript.
* Apply mutation XML manually.
* Generate `when Button1.Click` without dragging it from the palette.
* Inspect property setter blocks.
* Inspect method call blocks.
* Inspect text literal blocks connected to setters and methods.
