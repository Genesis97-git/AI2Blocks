class Program {
    constructor(body = []) {
        this.type = "Program";
        this.body = body;
    }
}

class ComponentEvent {
    constructor(component, event, body = []) {
        this.type = "ComponentEvent";
        this.component = component;
        this.event = event;
        this.body = body;
    }
}

class GetProperty {
  constructor(component, property) {
    this.type = "GetProperty";
    this.component = component;
    this.property = property;
  }
}

class SetProperty {
    constructor(component, property, value) {
        this.type = "SetProperty";
        this.component = component;
        this.property = property;
        this.value = value;
    }
}

class StringLiteral {
    constructor(value) {
        this.type = "StringLiteral";
        this.value = value;
    }
}

class NumberLiteral {
  constructor(value) {
    this.type = "NumberLiteral";
    this.value = Number(value);
  }
}

class BooleanLiteral {
  constructor(value) {
    this.type = "BooleanLiteral";
    this.value = value === true || value === "true";
  }
}

class ComponentMethodCall {
  constructor(component, method, args = []) {
    this.type = "ComponentMethodCall";
    this.component = component;
    this.method = method;
    this.args = args;
  }
}

class StatementStack {
  constructor(statements = []) {
    this.type = "StatementStack";
    this.statements = statements;
  }
}