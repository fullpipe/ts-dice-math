import { Token, TokenType } from './tokenizer';

export class Parser {
  private index = 0;
  private lastIndex = 0;
  private tokens: Token[] = [];
  private current = new Token();

  parse(tokens: Token[]) {
    this.tokens = tokens;
    this.index = 0;
    this.current = new Token();
    this.lastIndex = this.tokens.length - 1;

    return this.expectExpression();
  }

  private expectExpression(): Expression | null {
    let lhs = this.expectOneValue();
    if (!lhs) {
      return null;
    }

    const start = this.index;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const op = this.expectOperator();
      if (!op) break;

      const rhsOperator = OPERATORS.get(op.text);
      if (!rhsOperator) {
        this.index--;
        return lhs;
      }

      const rhs = this.expectOneValue();
      if (!rhs) {
        this.index = start;
        return lhs;
      }

      const rightmost = this.rightmostExpression(lhs, rhsOperator.precedence);
      if (rightmost) {
        const opExpr = new Expression(
          ExpressionType.OPERATOR_CALL,
          rhsOperator.name
        );

        opExpr.children.push(rightmost.children[1], rhs);
        rightmost.children[1] = opExpr;
      } else {
        const opExpr = new Expression(ExpressionType.OPERATOR_CALL, op.text);
        opExpr.children.push(lhs, rhs);
        lhs = opExpr;
      }
    }

    return lhs;
  }

  private expectFunctionCall(): Expression | null {
    const start = this.index;

    const possibleName = this.expectIdentifier();
    if (!possibleName) {
      this.index = start;
      return null;
    }

    const possibleOperator = this.expectOperator('(');
    if (!possibleOperator) {
      this.index = start;
      return null;
    }

    //We have function
    const funcExpr = new Expression(
      ExpressionType.FUNCTION_CALL,
      possibleName.text
    );

    // parse arguments as expressions
    while (!this.expectOperator(')')) {
      const argExpr = this.expectExpression();
      if (argExpr) {
        funcExpr.children.push(argExpr);
      }

      if (this.expectOperator(')')) {
        break;
      }

      if (!this.expectOperator(',')) {
        throw new Error('Expecting next function argument');
      }
    }

    return funcExpr;
  }

  private expectOneValue(): Expression | null {
    if (this.index > this.lastIndex) return null;

    if (this.expectOperator('(')) {
      const expr = this.expectExpression();

      if (!expr) {
        throw new Error('waiting for expression in ()');
      }

      if (!this.expectOperator(')')) {
        throw new Error('unballanced ()');
      }

      const group = new Expression(ExpressionType.GROUP, '()');
      group.children.push(expr);

      return group;
    }

    const start = this.index;
    const value = this.pop();

    switch (value.type) {
      case TokenType.INTEGER_LITERAL:
        return new Expression(ExpressionType.INTEGER, value.text);
      case TokenType.DICE_LITERAL:
        return new Expression(ExpressionType.DICE, value.text);
    }

    this.index = start;

    const funcExpr = this.expectFunctionCall();
    if (funcExpr) {
      return funcExpr;
    }

    this.index = start;
    return null;
  }

  // Looking for the right most OPERATOR_CALL expression a OPERATOR_CALL tree
  private rightmostExpression(
    lhs: Expression,
    precedence: number
  ): Expression | null {
    if (lhs.type !== ExpressionType.OPERATOR_CALL) return null;

    const lhsOperator = OPERATORS.get(lhs.name);
    if (!lhsOperator) return null;
    if (lhsOperator.precedence > precedence) return null;

    const rhs = this.rightmostExpression(lhs.children[1], precedence);

    return rhs ? rhs : lhs;
  }

  private expectIdentifier(name = '') {
    if (this.index > this.lastIndex) return null;
    if (this.peek().type !== TokenType.IDENTIFFIER) return null;
    if (name !== '' && this.peek().text !== name) return null;

    return this.pop();
  }

  private expectOperator(name = '') {
    if (this.index > this.lastIndex) return null;
    if (this.peek().type !== TokenType.OPERATOR) return null;
    if (name !== '' && this.peek().text !== name) return null;

    return this.pop();
  }

  private pop(): Token {
    const token = this.tokens[this.index];
    this.index++;

    return token;
  }

  private peek(): Token {
    return this.tokens[this.index];
  }
}

export class Expression {
  public children: Expression[] = [];

  constructor(public type: ExpressionType, public name: string) {}

  print(indent = 0) {
    console.log(`${'    '.repeat(indent)}${this.type} ${this.name}`);
    this.children.forEach(c => c.print(indent + 1));
  }
}

export enum ExpressionType {
  FUNCTION_CALL = 'FUNCTION_CALL',
  OPERATOR_CALL = 'OPERATOR_CALL',
  GROUP = 'GROUP',
  INTEGER = 'INTEGER',
  DICE = 'DICE',
}

type Operator = {
  name: string;
  precedence: number;
};

const OPERATORS: Map<string, Operator> = new Map([
  ['+', { name: '+', precedence: 1 }],
  ['-', { name: '-', precedence: 1 }],
  ['*', { name: '*', precedence: 10 }],
  ['/', { name: '/', precedence: 10 }],
]);
