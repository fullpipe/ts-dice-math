# ts-dice-math

D&D math for dice rolling. See demo [https://dice-math.fullpipe.dev/](https://dice-math.fullpipe.dev/)

## Install

```bash
npm install ts-dice-math --save
```

### Browser (tested with Angular)

You have to install `crypto-browserify`

```bash
npm intall --save crypto-browserify stream-browserify assert stream-http https-browserify os-browserify
```

and then add following to your `tsconfig.json`

```jsonp
{
  ...
  "compilerOptions": {
    ...
    "paths": {
      "crypto": ["./node_modules/crypto-browserify"],
      "stream": ["./node_modules/stream-browserify"],
      "assert": ["./node_modules/assert"],
      "http": ["./node_modules/stream-http"],
      "https": ["./node_modules/https-browserify"],
      "os": ["./node_modules/os-browserify"]
    }
  }
}
```

## Usage

```typescript
import { roll } from 'ts-dice-math';

...
// roll d20 with advantage
console.log(roll('adv(d20, d20)'));

// roll d20 with disadvantage
console.log(roll('dis(d20, d20)'));

// roll your two-handed sword damage
console.log(roll('2d6 + 3'));

// roll useless things
console.log(roll('d100 / 3 + adv(d20, d20) * 2 - dis(d100, d100, d6)'));
```

## What's included

| name | description |
| ---- | ----------- |
| `+`, `-`, `*`, `/` | simple math |
| `d20`, `3d6`, `d12 + d8` | dice rolls |
| `adv(d20, d20)`, `adv(d20 + 3, d20 + 3)` | Advantage. Roll two `d20` and choose best |
| `dis(d20, d20) + 3`, `dis(d20 + 3, d20 + 3)` | Disadvantage. Roll two `d20` and choose worst |

## Todo

- [ ] add more useful functions
- [ ] add validation
- [ ] add useful error messages with position of an error

Feel free to contribute.
