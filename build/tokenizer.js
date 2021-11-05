"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.Token = exports.Tokenizer = void 0;
class Tokenizer {
    constructor() {
        this.tokens = [];
        this.current = new Token();
    }
    tokenize(input) {
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
                    }
                    else if (this.current.type === TokenType.POTENTIAL_DICE_LITERAL) {
                        this.current.type = TokenType.DICE_LITERAL;
                        this.current.text += char;
                    }
                    else {
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
                    if (this.current.type === TokenType.WHITESPACE ||
                        this.current.type === TokenType.INTEGER_LITERAL) {
                        this.current.type = TokenType.POTENTIAL_DICE_LITERAL;
                        this.current.text += char;
                    }
                    else {
                        this.current.text += char;
                    }
                    break;
                default:
                    if (this.current.type === TokenType.WHITESPACE ||
                        this.current.type === TokenType.INTEGER_LITERAL ||
                        this.current.type === TokenType.DICE_LITERAL) {
                        this.endToken();
                        this.current.type = TokenType.IDENTIFFIER;
                        this.current.text += char;
                    }
                    else {
                        this.current.type = TokenType.IDENTIFFIER;
                        this.current.text += char;
                    }
                    break;
            }
        });
        this.endToken();
        return this.tokens;
    }
    endToken() {
        if (this.current.type !== TokenType.WHITESPACE) {
            this.tokens.push(this.current);
        }
        this.current = new Token();
    }
}
exports.Tokenizer = Tokenizer;
class Token {
    constructor(type = TokenType.WHITESPACE, text = '') {
        this.type = type;
        this.text = text;
    }
}
exports.Token = Token;
var TokenType;
(function (TokenType) {
    TokenType["WHITESPACE"] = "WHITESPACE";
    TokenType["IDENTIFFIER"] = "IDENTIFFIER";
    TokenType["INTEGER_LITERAL"] = "INTEGER_LITERAL";
    TokenType["DICE_LITERAL"] = "DICE_LITERAL";
    TokenType["POTENTIAL_DICE_LITERAL"] = "POTENTIAL_DICE_LITERAL";
    TokenType["OPERATOR"] = "OPERATOR";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
//# sourceMappingURL=tokenizer.js.map