"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiceMath = void 0;
const parser_1 = require("./parser");
const tokenizer_1 = require("./tokenizer");
const { rando } = require('@nastyox/rando.js');
class DiceMath {
    constructor() {
        this.tokenizer = new tokenizer_1.Tokenizer();
        this.parser = new parser_1.Parser();
    }
    roll(exp) {
        const tree = this.parser.parse(this.tokenizer.tokenize(exp));
        if (!tree) {
            throw new Error(`Unable to parse: ${exp}`);
        }
        return Math.floor(this.eval(tree));
    }
    eval(exp) {
        switch (exp.type) {
            case parser_1.ExpressionType.GROUP:
                return this.group(exp);
            case parser_1.ExpressionType.INTEGER:
                return +exp.name;
            case parser_1.ExpressionType.DICE:
                return this.dice(exp.name);
            case parser_1.ExpressionType.OPERATOR_CALL:
                return this.operator(exp);
            case parser_1.ExpressionType.FUNCTION_CALL:
                return this.func(exp);
            default:
                throw new Error(`Don't known what to do with expression: ${exp.name}<${exp.type}>`);
        }
    }
    dice(dice) {
        const regex = /([\d]+)?(?:d|к)([\d]+)/gm;
        let m;
        let rolled = 0;
        while ((m = regex.exec(dice)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            let num = +(m[1] || 1);
            while (num--) {
                rolled += rando(1, +m[2]);
            }
        }
        return rolled;
    }
    group(exp) {
        switch (exp.name) {
            case '()':
                return this.eval(exp.children[0]);
        }
        throw new Error(`Don't known what to do with group: ${exp.name}`);
    }
    operator(exp) {
        switch (exp.name) {
            case '+':
                return this.eval(exp.children[0]) + this.eval(exp.children[1]);
            case '-':
                return this.eval(exp.children[0]) - this.eval(exp.children[1]);
            case '*':
                return this.eval(exp.children[0]) * this.eval(exp.children[1]);
            case '/':
                return this.eval(exp.children[0]) / this.eval(exp.children[1]);
        }
        throw new Error(`Don't known what to do with operator: ${exp.name}`);
    }
    func(exp) {
        switch (exp.name) {
            case 'adv':
                return Math.max(...exp.children.map(c => this.eval(c)));
            case 'dis':
                return Math.min(...exp.children.map(c => this.eval(c)));
        }
        throw new Error(`Don't known what to do with function: ${exp.name}`);
    }
}
exports.DiceMath = DiceMath;
//# sourceMappingURL=dice-math.js.map