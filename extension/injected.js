console.log("[AI2Blocks] Injected script loaded");

function importXml(xmlText) {
  const ws = Blockly.getMainWorkspace();

  const xml = new DOMParser()
    .parseFromString(xmlText, "text/xml")
    .documentElement;

  const existingGlobals = getExistingGlobalVariables();

  const missingGlobals = validateImportedGlobalReferences(xml, existingGlobals);

  if (missingGlobals.length > 0) {
    alert(
      "Import cancelled.\n\n" +
      "The following global variable(s) are referenced but do not exist and are not declared in this import:\n\n" +
      missingGlobals.map(name => `• ${name}`).join("\n") +
      "\n\nAdd an initialize global block or create the variable in App Inventor first."
    );
    return;
  }

  const renamedVariables = renameImportedGlobals(xml, existingGlobals);

  if (renamedVariables.length > 0) {
    alert(
      "The following global variable(s) were automatically renamed because variables with the same name already exist:\n\n" +
      renamedVariables
        .map(v => `${v.oldName} → ${v.newName}`)
        .join("\n")
    );
  }

  Blockly.Xml.domToWorkspace(xml, ws);
}

function getSelectedBlocks() {
  const selected = Blockly.getSelected();

  if (!selected) {
    const fallback = Blockly.getMainWorkspace().getTopBlocks(false)[0];
    return fallback ? [fallback] : [];
  }

  if (selected.subDraggables instanceof Map) {
    return Array.from(selected.subDraggables.keys())
      .filter(block => block && block.type);
  }

  return selected.type ? [selected] : [];
}

function inspectBlock(block) {
  return {
    type: block.type,
    blockType: block.blockType,
    typeName: block.typeName,
    instanceName: block.instanceName,
    propertyName: block.propertyName,
    methodName: block.methodName,
    eventName: block.eventName,
    mutation: getMutationText(block),
    xml: Blockly.Xml.domToPrettyText(
      Blockly.Xml.blockToDom(block)
    )
  };
}

function getMutationText(block) {
  if (!block.mutationToDom) {
    return null;
  }

  const mutation = block.mutationToDom();

  if (!mutation || !(mutation instanceof Node)) {
    return null;
  }

  return Blockly.Xml.domToText(mutation);
}

function getBlockXml(block) {
  try {
    return Blockly.Xml.domToPrettyText(
      Blockly.Xml.blockToDom(block)
    );
  } catch (error) {
    return `[XML export failed: ${error.message}]`;
  }
}

function getExistingGlobalVariables() {
  return Blockly.getMainWorkspace()
    .getTopBlocks(false)
    .filter(block => block.type === "global_declaration")
    .map(block => block.getFieldValue("NAME"));
}

function getUniqueGlobalName(baseName, usedNames) {
  if (!usedNames.includes(baseName)) {
    return baseName;
  }

  let index = 2;

  while (usedNames.includes(`${baseName}${index}`)) {
    index++;
  }

  return `${baseName}${index}`;
}

function renameImportedGlobals(xml, existingGlobals) {
  const usedNames = [...existingGlobals];
  const renameMap = new Map();
  const renamedVariables = [];

  const declarationFields = Array.from(
    xml.querySelectorAll('block[type="global_declaration"] > field[name="NAME"]')
  );

  for (const field of declarationFields) {
    const originalName = field.textContent;
    const newName = getUniqueGlobalName(originalName, usedNames);

    if (newName !== originalName) {
      renameMap.set(originalName, newName);
      renamedVariables.push({
        oldName: originalName,
        newName
      });

      field.textContent = newName;
    }

    usedNames.push(newName);
  }

  const variableFields = Array.from(
    xml.querySelectorAll(
      'block[type="lexical_variable_get"] > field[name="VAR"], block[type="lexical_variable_set"] > field[name="VAR"]'
    )
  );

  for (const field of variableFields) {
    const value = field.textContent;

    if (!value.startsWith("global ")) continue;

    const originalName = value.replace(/^global\s+/, "");
    const newName = renameMap.get(originalName);

    if (newName) {
      field.textContent = `global ${newName}`;
    }
  }

  return renamedVariables;
}

function getDeclaredImportedGlobals(xml) {
  return Array.from(
    xml.querySelectorAll('block[type="global_declaration"] > field[name="NAME"]')
  ).map(field => field.textContent);
}

function getReferencedImportedGlobals(xml) {
  return Array.from(
    xml.querySelectorAll(
      'block[type="lexical_variable_get"] > field[name="VAR"], block[type="lexical_variable_set"] > field[name="VAR"]'
    )
  )
    .map(field => field.textContent)
    .filter(value => value.startsWith("global "))
    .map(value => value.replace(/^global\s+/, ""));
}

function validateImportedGlobalReferences(xml, existingGlobals) {
  const declaredImportedGlobals = new Set(getDeclaredImportedGlobals(xml));
  const existingGlobalSet = new Set(existingGlobals);
  const referencedGlobals = getReferencedImportedGlobals(xml);

  const missingGlobals = [];

  for (const name of referencedGlobals) {
    const isDeclaredInImport = declaredImportedGlobals.has(name);
    const existsInWorkspace = existingGlobalSet.has(name);

    if (!isDeclaredInImport && !existsInWorkspace && !missingGlobals.includes(name)) {
      missingGlobals.push(name);
    }
  }

  return missingGlobals;
}

function inspectSelectedBlock() {
  const blocks = getSelectedBlocks();

  if (blocks.length === 0) {
    console.warn("[AI2Blocks] No block found to inspect.");
    return;
  }

  const result = blocks.length === 1
  ? inspectBlock(blocks[0])
  : blocks.map((block, index) => ({
      index,
      ...inspectBlock(block)
    }));

  const json = JSON.stringify(result, null, 2);

  console.group("[AI2Blocks] Block Inspection");
  console.log(result);
  console.log("Copy/paste JSON:");
  console.log(json);
  console.groupEnd();
}

window.AI2Blocks = {
  generate(xmlText) {
    console.log("[AI2Blocks] Importing XML...");
    importXml(xmlText);
  }
};

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  const message = event.data;

  if (message.type === "AI2BLOCKS_GENERATE_FROM_EXTENSION") {
    window.AI2Blocks.generate(message.scriptText);
    return;
  }

  if (message.type === "AI2BLOCKS_INSPECT_BLOCK_FROM_EXTENSION") {
    inspectSelectedBlock();
    return;
  }
});