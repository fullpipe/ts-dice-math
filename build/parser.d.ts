import { Token } from './tokenizer';
export declare class Parser {
    private index;
    private lastIndex;
    private tokens;
    private current;
    parse(tokens: Token[]): Expression | null;
    private expectExpression;
    private expectFunctionCall;
    private expectOneValue;
    private rightmostExpression;
    private expectIdentifier;
    private expectOperator;
    private pop;
    private peek;
}
export declare class Expression {
    type: ExpressionType;
    name: string;
    children: Expression[];
    constructor(type: ExpressionType, name: string);
    print(indent?: number): void;
}
export declare enum ExpressionType {
    FUNCTION_CALL = "FUNCTION_CALL",
    OPERATOR_CALL = "OPERATOR_CALL",
    GROUP = "GROUP",
    INTEGER = "INTEGER",
    DICE = "DICE"
}
