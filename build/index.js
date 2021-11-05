"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roll = void 0;
const dice_math_1 = require("./dice-math");
const diceMath = new dice_math_1.DiceMath();
function roll(exp) {
    return diceMath.roll(exp);
}
exports.roll = roll;
//# sourceMappingURL=index.js.map