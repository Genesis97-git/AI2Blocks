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

### Boolean Logic

AI2Blocks supports boolean expressions:

```text
true and false
true or false
not true
```
Boolean logic can be combined with comparisons:
```text
get global score > 10 and Label1.Visible
not get global gameOver
```
Current behavior:

- and generates App Inventor logic AND
- or generates App Inventor logic OR
- not generates App Inventor logic NOT

## Global Variables

### Creating a New Global Variable

A global variable is created using:

```text
initialize global score to 0
```

This always creates a new global variable within the imported program.

---

### Editing an Existing Global Variable

```text
set global score to 10
```

or

```text
get global score
```

These refer to an existing global variable.

No new variable is created.

---

### Import Rules

AI2Blocks distinguishes between **declared** and **referenced** global variables.

### Expression Evaluation

Binary expressions are currently evaluated strictly from left to right.

Example:

```text
10 - 3 * 2 + 7 / 4
```

is interpreted as:

```text
(((10 - 3) * 2) + 7) / 4
```

This behavior is deterministic and matches the generated block structure.

Standard arithmetic operator precedence is **not** currently implemented.

Support for operator precedence and explicit grouping with parentheses may be added in a future version.

### Comparisons

AI2Blocks supports comparison expressions:

```text
get global score > 10
get global score < 10
get global score >= 10
get global score <= 10
get global score = 10
get global score != 10
```

#### Comparison Operator Aliases

AI2Blocks accepts a small number of compatibility aliases.

| Alias | Canonical |
|-------|-----------|
| `==` | `=` |
| `<>` | `!=` |

Internally, AI2Blocks normalizes all aliases to the canonical operators.

#### Declared Globals

A global variable is considered declared if it appears as:

```text
initialize global score to ...
```

Declared globals belong to the imported program.

If a declared global conflicts with an existing workspace variable, AI2Blocks automatically renames the imported declaration and all imported references.

Example:

```text
initialize global score to 0
set global score to 10
```

↓

```text
initialize global score2 to 0
set global score2 to 10
```

The user is notified of every automatic rename.

---

#### Referenced Globals

A variable that is only used through:

```text
set global ...
get global ...
```

is assumed to already exist in the workspace.

Example:

```text
set global score to 10
```

means:

> Modify the existing variable `score`.

---

### Missing Global Variables

If a referenced global variable:

- is not declared in the imported script, and
- does not already exist in the workspace,

the import is cancelled and AI2Blocks displays a warning.

Example:

```text
set global score to 10
```

will fail if `score` does not exist.

---

### Design Principle

The user's script always has priority.

AI2Blocks never changes the meaning of a script.

Only imported variables that are explicitly declared by the script may be automatically renamed to avoid conflicts.

---

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

## Control flow
### If

Use if to run statements only when a condition is true.

A single-statement body does not require parentheses:
```text
if get global score >= 10
set Label1.Text to "Winner!"
```
For multiple statements, wrap the body in parentheses:
```text
if get global score >= 10 (
set Label1.Text to "Winner!"
set Button1.Enabled to false
call Notifier1.ShowAlert("Target reached!")
)
```
The condition may use any supported boolean expression:
```text
if true
set Label1.Visible to true
if get global score > 0 and Button1.Enabled
set Label1.Text to "Ready"
```
### If / Else

Use else to provide an alternative branch when the if condition is false.

Single-statement form:
```text
if get global score >= 10
set Label1.Text to "Winner!"
else
set Label1.Text to "Keep going"
```
Grouped form:
```text
if get global score >= 10 (
set Label1.Text to "Winner!"
set Button1.Enabled to false
)
else (
set Label1.Text to "Keep going"
set Button1.Enabled to true
)
```
### Else If

One or more else if branches may appear between the initial if and an optional final else.
```text
if get global score >= 10
set Label1.Text to "Excellent"
else if get global score >= 7
set Label1.Text to "Good"
else if get global score >= 4
set Label1.Text to "Average"
else
set Label1.Text to "Keep trying"
```
Each else if branch follows the same body rules as if:
```text
else if get global score >= 5 (
set Label1.Text to "Almost there"
set Button1.Enabled to true
)
```

### Nested If Statements

if statements may be nested inside other branches.
```text
if get global score > 0 (
if get global score >= 10
set Label1.Text to "Winner!"
else
set Label1.Text to "In progress"
)
```
Without parentheses, an else belongs to the nearest unmatched if:
```text
if true
if false
set Label1.Text to "Inner true"
else
set Label1.Text to "Inner false"
```
Here, the else belongs to if false.

### Body Grouping

AI2Blocks does not use indentation to determine nesting.

The rules are:

- A body without parentheses contains exactly one statement.
- A body wrapped in ( and ) may contain multiple statements.
- Parentheses are optional when the body contains only one statement.
- Indentation may be used for readability, but it does not affect parsing.

Example:
```text
if get global score >= 3 (
  set Label1.Text to "Target reached!"
  set Button1.Enabled to false
)
```
is parsed the same as:
```text
if get global score >= 3 (
set Label1.Text to "Target reached!"
set Button1.Enabled to false
)
```
#### then

Statement if does not use the word then.

Canonical syntax:
```text
if get global score >= 10
set Label1.Text to "Winner!"
```
The value-producing if then else expression may use then in a future version, but it is not currently implemented.

## Design Philosophy

AI2Blocks should infer user intent whenever it can without introducing new language syntax.

Whenever possible, existing App Inventor semantics should be preferred over AI2Blocks-specific keywords or commands.

## Forgiving Parsing

AI2Blocks should prefer valid structured syntax, but avoid failing completely when possible.

If grouping parentheses are missing, the parser should still generate useful blocks as disconnected or partially connected stacks.

The goal is not to reject imperfect AI output, but to create as much of the App Inventor workspace as possible and let the user manually fix small connection issues if needed.

## Indentation is ignored. Blank lines separate top-level stacks.

## Section Markers (Planned)

Future versions of AI2Blocks may support explicit sections.

Example:

```text
[Designer]

...

[Blocks]

...
```

Section markers allow AI2Blocks to distinguish between:

- Designer component generation
- Blocks generation
- Other project resources (future)

If a section is omitted, AI2Blocks assumes the corresponding part of the project should remain unchanged.

