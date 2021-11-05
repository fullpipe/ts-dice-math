export declare class Tokenizer {
    private tokens;
    private current;
    tokenize(input: string): Token[];
    private endToken;
}
export declare class Token {
    type: TokenType;
    text: string;
    constructor(type?: TokenType, text?: string);
}
export declare enum TokenType {
    WHITESPACE = "WHITESPACE",
    IDENTIFFIER = "IDENTIFFIER",
    INTEGER_LITERAL = "INTEGER_LITERAL",
    DICE_LITERAL = "DICE_LITERAL",
    POTENTIAL_DICE_LITERAL = "POTENTIAL_DICE_LITERAL",
    OPERATOR = "OPERATOR"
}
