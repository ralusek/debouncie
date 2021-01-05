[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ralusek/debouncie/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/debouncie.svg?style=flat)](https://www.npmjs.com/package/debouncie)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ralusek/debouncie/blob/master/LICENSE)

## Debounce function which returns a promise. Lower memory footprint than alternative solutions

Node Install:
`$ npm install --save debouncie`
Deno Install:
`coming soon`


### Example

```javascript
import debouncie from 'debouncie';

function someAsyncFunction(a, b, c) {
  return Promise.resolve();
}

const debounced = debouncie(someAsyncFunction, { debounce: 500 });

debounced('a', 'b', 'c')
.then(() => {
  // Do something else. This doesn't normally return a promise in, for example, lodash debounce.
});
