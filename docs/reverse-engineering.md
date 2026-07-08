# Reverse Engineering Notes

This document records discoveries about MIT App Inventor's Blockly implementation.

---

# Workspace

## Accessing the Workspace

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

# XML

## Loading XML

App Inventor does not expose `Blockly.Xml.textToDom()`.

Instead:

```js
const xml = new DOMParser()
  .parseFromString(xmlText, "text/xml")
  .documentElement;

Blockly.Xml.domToWorkspace(xml, ws);
```

Single block:

```js
Blockly.Xml.domToBlock(blockXml, ws);
```

---

# Selection

## Multi-block Selection

App Inventor supports:

- Shift-click selection
- Mouse drag selection

### Selected blocks

```js
Array.from(
    Blockly.getSelected().subDraggables.keys()
)
```

### Ordering

- Shift-click preserves user selection order.
- Drag selection currently follows Blockly internal ordering.
- Inspection tools should **not rely on ordering**.

---

# Component Blocks

## Component Event

Example:

```text
when Button1.Click
```

Type:

```text
component_event
```

Properties:

```js
blockType
typeName
instanceName
eventName
```

Inputs:

```text
WHENTITLE
DO
```

Mutation:

```xml
<mutation
  component_type="Button"
  is_generic="false"
  instance_name="Button1"
  event_name="Click">
</mutation>
```

---

## Component Property Setter

Example:

```text
set Label1.Text to "Hello"
```

Type:

```text
component_set_get
```

Mutation:

```xml
<mutation
  component_type="Label"
  set_or_get="set"
  property_name="Text"
  is_generic="false"
  instance_name="Label1">
</mutation>
```

Input:

```text
VALUE
```

---

## Component Property Getter

Example:

```text
Label1.Text
```

Type:

```text
component_set_get
```

Mutation:

```xml
<mutation
  component_type="Label"
  set_or_get="get"
  property_name="Text"
  is_generic="false"
  instance_name="Label1">
</mutation>
```

No value inputs.

---

# Variables

## Global Declaration

Example:

```text
initialize global score to 0
```

Type:

```text
global_declaration
```

Field:

```text
NAME
```

Value input:

```text
VALUE
```

---

## Global Getter

Example:

```text
get global score
```

Type:

```text
lexical_variable_get
```

Field:

```text
VAR = global score
```

---

## Global Setter

Example:

```text
set global score to 10
```

Type:

```text
lexical_variable_set
```

Field:

```text
VAR = global score
```

Input:

```text
VALUE
```

---

## Duplicate Global Variables

### Disabled blocks

Disabled global declarations may have duplicate names.

Re-enabling them does **not** trigger automatic renaming.

### Runtime

Multiple enabled globals with the same name are possible.

Current observation:

- Getter resolved to the declaration at the bottom of the workspace.

Reason is still unknown.

### Manual Rename

Manual variable rename:

- prevents duplicate names
- renames all getters/setters

Source:

- `FieldGlobalFlydown`
- `LexicalVariable.renameGlobal()`

Raw XML import may not execute the same rename path.

---

# Current Questions

- Why does duplicate resolution choose the bottom declaration?
- Which internal data structure links getters/setters to declarations?
- Can AI2Blocks invoke App Inventor's rename mechanism after import?