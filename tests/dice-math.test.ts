import { DiceMath } from '../src/dice-math';
import { expect } from 'chai';

describe('Dice math', () => {
  it('rolls primitives', () => {
    const math = new DiceMath();

    expect(math.roll('2')).to.eq(2);

    expect(math.roll('2+2')).to.eq(4);
    expect(math.roll('2-1')).to.eq(1);

    let rolls = 100;
    while (rolls--) {
      expect(math.roll('2d6')).to.greaterThanOrEqual(2).and.lessThanOrEqual(12);
    }

    rolls = 100;
    while (rolls--) {
      expect(math.roll('d20')).to.greaterThanOrEqual(1).and.lessThanOrEqual(20);
    }
  });

  it('rounds to the floor', () => {
    const math = new DiceMath();

    expect(math.roll('3/2')).to.eq(1);
    expect(math.roll('(2+2)/3')).to.eq(1);
  });

  it('functions try', () => {
    const math = new DiceMath();

    expect(math.roll('adv(2,3)')).to.eq(3);
    expect(math.roll('dis(2,3)')).to.eq(2);
    expect(() => math.roll('foo(2,3)')).to.throw();
  });
});
