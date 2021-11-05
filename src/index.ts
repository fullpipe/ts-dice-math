import { DiceMath } from './dice-math';

const diceMath = new DiceMath();
export function roll(exp: string) {
  return diceMath.roll(exp);
}
