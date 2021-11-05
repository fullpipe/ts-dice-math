"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionType = exports.Expression = exports.Parser = void 0;
const tokenizer_1 = require("./tokenizer");
class Parser {
    constructor() {
        this.index = 0;
        this.lastIndex = 0;
        this.tokens = [];
        this.current = new tokenizer_1.Token();
    }
    parse(tokens) {
        this.tokens = tokens;
        this.index = 0;
        this.current = new tokenizer_1.Token();
        this.lastIndex = this.tokens.length - 1;
        return this.expectExpression();
    }
    expectExpression() {
        let lhs = this.expectOneValue();
        if (!lhs) {
            return null;
        }
        const start = this.index;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const op = this.expectOperator();
            if (!op)
                break;
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
                const opExpr = new Expression(ExpressionType.OPERATOR_CALL, rhsOperator.name);
                opExpr.children.push(rightmost.children[1], rhs);
                rightmost.children[1] = opExpr;
            }
            else {
                const opExpr = new Expression(ExpressionType.OPERATOR_CALL, op.text);
                opExpr.children.push(lhs, rhs);
                lhs = opExpr;
            }
        }
        return lhs;
    }
    expectFunctionCall() {
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
        const funcExpr = new Expression(ExpressionType.FUNCTION_CALL, possibleName.text);
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
    expectOneValue() {
        if (this.index > this.lastIndex)
            return null;
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
            case tokenizer_1.TokenType.INTEGER_LITERAL:
                return new Expression(ExpressionType.INTEGER, value.text);
            case tokenizer_1.TokenType.DICE_LITERAL:
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
    rightmostExpression(lhs, precedence) {
        if (lhs.type !== ExpressionType.OPERATOR_CALL)
            return null;
        const lhsOperator = OPERATORS.get(lhs.name);
        if (!lhsOperator)
            return null;
        if (lhsOperator.precedence > precedence)
            return null;
        const rhs = this.rightmostExpression(lhs.children[1], precedence);
        return rhs ? rhs : lhs;
    }
    expectIdentifier(name = '') {
        if (this.index > this.lastIndex)
            return null;
        if (this.peek().type !== tokenizer_1.TokenType.IDENTIFFIER)
            return null;
        if (name !== '' && this.peek().text !== name)
            return null;
        return this.pop();
    }
    expectOperator(name = '') {
        if (this.index > this.lastIndex)
            return null;
        if (this.peek().type !== tokenizer_1.TokenType.OPERATOR)
            return null;
        if (name !== '' && this.peek().text !== name)
            return null;
        return this.pop();
    }
    pop() {
        const token = this.tokens[this.index];
        this.index++;
        return token;
    }
    peek() {
        return this.tokens[this.index];
    }
}
exports.Parser = Parser;
class Expression {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.children = [];
    }
    print(indent = 0) {
        console.log(`${'    '.repeat(indent)}${this.type} ${this.name}`);
        this.children.forEach(c => c.print(indent + 1));
    }
}
exports.Expression = Expression;
var ExpressionType;
(function (ExpressionType) {
    ExpressionType["FUNCTION_CALL"] = "FUNCTION_CALL";
    ExpressionType["OPERATOR_CALL"] = "OPERATOR_CALL";
    ExpressionType["GROUP"] = "GROUP";
    ExpressionType["INTEGER"] = "INTEGER";
    ExpressionType["DICE"] = "DICE";
})(ExpressionType = exports.ExpressionType || (exports.ExpressionType = {}));
const OPERATORS = new Map([
    ['+', { name: '+', precedence: 1 }],
    ['-', { name: '-', precedence: 1 }],
    ['*', { name: '*', precedence: 10 }],
    ['/', { name: '/', precedence: 10 }],
]);
//# sourceMappingURL=parser.js.map