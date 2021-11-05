export class Tokenizer {
  private tokens: Token[] = [];
  private current = new Token();

  tokenize(input: string): Token[] {
    this.tokens = [];
    this.current = new Token();

    input.split('').forEach(char => {
      switch (char) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (this.current.type === TokenType.WHITESPACE) {
            this.current.type = TokenType.INTEGER_LITERAL;
            this.current.text += char;
          } else if (this.current.type === TokenType.POTENTIAL_DICE_LITERAL) {
            this.current.type = TokenType.DICE_LITERAL;
            this.current.text += char;
          } else {
            this.current.text += char;
          }
          break;
        case '(':
        case ')':
        case '+':
        case '-':
        case '*':
        case '/':
        case ',':
          this.endToken();
          this.current.type = TokenType.OPERATOR;
          this.current.text += char;
          this.endToken();
          break;
        case ' ':
        case '\t':
          this.endToken();
          break;
        case '\n':
        case '\r':
          this.endToken();
          //   this.current.lineNumber++;
          break;
        case 'd':
          if (
            this.current.type === TokenType.WHITESPACE ||
            this.current.type === TokenType.INTEGER_LITERAL
          ) {
            this.current.type = TokenType.POTENTIAL_DICE_LITERAL;
            this.current.text += char;
          } else {
            this.current.text += char;
          }
          break;
        default:
          if (
            this.current.type === TokenType.WHITESPACE ||
            this.current.type === TokenType.INTEGER_LITERAL ||
            this.current.type === TokenType.DICE_LITERAL
          ) {
            this.endToken();
            this.current.type = TokenType.IDENTIFFIER;
            this.current.text += char;
          } else {
            this.current.type = TokenType.IDENTIFFIER;
            this.current.text += char;
          }
          break;
      }
    });

    this.endToken();

    return this.tokens;
  }

  private endToken() {
    if (this.current.type !== TokenType.WHITESPACE) {
      this.tokens.push(this.current);
    }

    this.current = new Token();
  }
}

export class Token {
  constructor(public type = TokenType.WHITESPACE, public text = '') {}
  //   startOffset = 0;
  //   endOffset = 0;
  //   lineNumber = 1;
}

export enum TokenType {
  WHITESPACE = 'WHITESPACE',
  IDENTIFFIER = 'IDENTIFFIER',
  INTEGER_LITERAL = 'INTEGER_LITERAL',
  DICE_LITERAL = 'DICE_LITERAL',
  POTENTIAL_DICE_LITERAL = 'POTENTIAL_DICE_LITERAL',
  OPERATOR = 'OPERATOR',
}
