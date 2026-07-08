# AI2Blocks Language

## Events

when Button1.Click

## Property Assignment

set Label1.Text to "Hello"

## Literals

### String

"Hello"

### Number

100

3.14

-42

### Boolean

true

false

## Top-Level Stacks

A blank line separates top-level block stacks.

Example:

set Label1.Visible to true
set Label1.Height to 50

set Label1.Text to "Hello"

Produces two independent stacks in the Blockly workspace.

### Top-level blocks

A paragraph may produce multiple top-level blocks.

Example:

initialize global score to 0
set global score to 10

Produces:

- Global declaration
- Statement stack

Global declarations are always standalone blocks and never connect to statement stacks.

## Forgiving Parsing

AI2Blocks should prefer valid structured syntax, but avoid failing completely when possible.

If grouping parentheses are missing, the parser should still generate useful blocks as disconnected or partially connected stacks.

The goal is not to reject imperfect AI output, but to create as much of the App Inventor workspace as possible and let the user manually fix small connection issues if needed.

## Indentation is ignored. Blank lines separate top-level stacks.

