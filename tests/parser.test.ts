import { Tokenizer } from '../src/tokenizer';
import { Parser } from '../src/parser';
import { expect } from 'chai';

describe('Parser tests', () => {
  // it('parse primitives', () => {
  //   const tokenizer = new Tokenizer();
  //   const parser = new Parser();

  //   expect(parser.parse(tokenizer.tokenize('2'))).to.eq(
  //     new Expression(ExpressionType.INTEGER, '2')
  //   );
  //   expect(parser.parse(tokenizer.tokenize('d2'))).to.eq(
  //     new Expression(ExpressionType.DICE, 'd2')
  //   );
  //   expect(parser.parse(tokenizer.tokenize('foo()'))).to.eq(
  //     new Expression(ExpressionType.FUNCTION_CALL, 'foo')
  //   );
  // });

  it('parse', () => {
    const tokenizer = new Tokenizer();
    const parser = new Parser();

    parser
      .parse(tokenizer.tokenize('2 + adv(2d20, d4 / 2) * 2 + dis(d20, d20)'))!
      .print();
    parser.parse(tokenizer.tokenize('(2+2)/3'))!.print();
  });
});
