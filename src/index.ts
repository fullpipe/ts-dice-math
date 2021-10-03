export class Lexer {
  tokenize(input: string): Token[] {
    let v = '';
    const tokens: Token[] = [];

    input.split('').forEach(char => {
      if (char === ' ') {
        return;
      }

      switch (char) {
        case '+':
        case '-':
        case '*':
        case '/':
          tokens.push(new Token(TokenType.literal, v));
          tokens.push(new Token(TokenType.operator, char));
          v = '';

          return;
        case '(':
        case ')':
          tokens.push(new Token(TokenType.literal, v));
          tokens.push(new Token(TokenType.separator, char));
          v = '';

          return;
      }

      v = v + char;
      switch (v) {
        case 'adv':
        case 'dis':
          tokens.push(new Token(TokenType.keyword, v));
          v = '';

          return;
      }
    });

    tokens.push(new Token(TokenType.literal, v));

    return tokens.filter(t => {
      return t.type !== TokenType.literal || t.value;
    });
  }
}

export class Token {
  constructor(public type: TokenType, public value?: unknown) {}
}

export enum TokenType {
  identifier, //	x, color, UP
  keyword, //	if, while, return
  separator, //	}, (, ;
  operator, //	+, <, =
  literal, //	true, 6.02e23, "music"
}
