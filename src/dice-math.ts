import { Expression, ExpressionType, Parser } from './parser';
import { Tokenizer } from './tokenizer';
const { rando } = require('@nastyox/rando.js');

export class DiceMath {
  private tokenizer = new Tokenizer();
  private parser = new Parser();

  roll(exp: string): number {
    const tree = this.parser.parse(this.tokenizer.tokenize(exp));

    if (!tree) {
      throw new Error(`Unable to parse: ${exp}`);
    }

    return Math.floor(this.eval(tree));
  }

  private eval(exp: Expression): number {
    switch (exp.type) {
      case ExpressionType.GROUP:
        return this.group(exp);
      case ExpressionType.INTEGER:
        return +exp.name;
      case ExpressionType.DICE:
        return this.dice(exp.name);
      case ExpressionType.OPERATOR_CALL:
        return this.operator(exp);
      case ExpressionType.FUNCTION_CALL:
        return this.func(exp);
      default:
        throw new Error(
          `Don't known what to do with expression: ${exp.name}<${exp.type}>`
        );
    }
  }

  private dice(dice: string): number {
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

  private group(exp: Expression): number {
    switch (exp.name) {
      case '()':
        return this.eval(exp.children[0]);
    }

    throw new Error(`Don't known what to do with group: ${exp.name}`);
  }

  private operator(exp: Expression): number {
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

  private func(exp: Expression): number {
    switch (exp.name) {
      case 'adv':
        return Math.max(...exp.children.map(c => this.eval(c)));
      case 'dis':
        return Math.min(...exp.children.map(c => this.eval(c)));
    }

    throw new Error(`Don't known what to do with function: ${exp.name}`);
  }
}
