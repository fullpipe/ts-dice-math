import { Tokenizer, Token, TokenType } from '../src/tokenizer';
import { expect } from 'chai';

describe('Tokenizer tests', () => {
  it('tokenize primitives', () => {
    const tokenizer = new Tokenizer();

    expect(tokenizer.tokenize('d4')).to.eql([
      new Token(TokenType.DICE_LITERAL, 'd4'),
    ]);

    expect(tokenizer.tokenize('4')).to.eql([
      new Token(TokenType.INTEGER_LITERAL, '4'),
    ]);

    expect(tokenizer.tokenize('foo()')).to.eql([
      new Token(TokenType.IDENTIFFIER, 'foo'),
      new Token(TokenType.OPERATOR, '('),
      new Token(TokenType.OPERATOR, ')'),
    ]);
  });

  it('tokenize', () => {
    const tokenizer = new Tokenizer();

    expect(tokenizer.tokenize('d4-4+adv(d20 + 6, 2d20)')).to.eql([
      new Token(TokenType.DICE_LITERAL, 'd4'),
      new Token(TokenType.OPERATOR, '-'),
      new Token(TokenType.INTEGER_LITERAL, '4'),
      new Token(TokenType.OPERATOR, '+'),
      new Token(TokenType.IDENTIFFIER, 'adv'),
      new Token(TokenType.OPERATOR, '('),
      new Token(TokenType.DICE_LITERAL, 'd20'),
      new Token(TokenType.OPERATOR, '+'),
      new Token(TokenType.INTEGER_LITERAL, '6'),
      new Token(TokenType.OPERATOR, ','),
      new Token(TokenType.DICE_LITERAL, '2d20'),
      new Token(TokenType.OPERATOR, ')'),
    ]);
  });

  it('tokenize func', () => {
    const tokenizer = new Tokenizer();

    expect(tokenizer.tokenize('adv(d20 + 6, 2d20)')).to.eql([
      new Token(TokenType.IDENTIFFIER, 'adv'),
      new Token(TokenType.OPERATOR, '('),
      new Token(TokenType.DICE_LITERAL, 'd20'),
      new Token(TokenType.OPERATOR, '+'),
      new Token(TokenType.INTEGER_LITERAL, '6'),
      new Token(TokenType.OPERATOR, ','),
      new Token(TokenType.DICE_LITERAL, '2d20'),
      new Token(TokenType.OPERATOR, ')'),
    ]);
  });
});
