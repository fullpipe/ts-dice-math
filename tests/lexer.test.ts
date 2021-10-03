import { Lexer, Token, TokenType } from '../src/index';
import { expect } from 'chai';

describe('Lexer tests', () => {
  it('tokenize', () => {
    const lexer = new Lexer();

    expect(lexer.tokenize('d20 + 6')).to.equal([
      new Token(TokenType.literal, 'd20'),
      new Token(TokenType.operator, '+'),
      new Token(TokenType.literal, '6'),
    ]);
  });
});
