import 'mocha';
import { expect } from 'chai';

import debouncie from '../../lib';


describe('Invocation', () => {
  it('should be able to be executed.', () => {
    async function asyncFunction() {
    }

    const debounced = debouncie(asyncFunction, { debounce: 200 });
    debounced();
  });

  it('should pass through the params to the debounced function.', () => {
    const params = {
      a: 'a',
      b: 'b',
    };

    function asyncFunction(a: any, b: any) {
      expect(a).to.equal(params.a);
      expect(b).to.equal(params.b);
    }

    const debounced = debouncie(asyncFunction, { debounce: 200 });
    debounced(params.a, params.b);
  });

  it('should handle single execution timing as expected.', () => {
    const TIME = 100;

    let ran = false;
    let resolved = false;
    async function asyncFunction() {
      ran = true;
    }

    const debounced = debouncie(asyncFunction, { debounce: TIME });
    const promise = debounced();
    
    promise.then(() => {
      expect(resolved).to.be.false;
      resolved = true;
    });

    expect(ran).to.be.false;

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(ran).to.be.true;
        expect(resolved).to.be.true;
        resolve();
      }, TIME + 50);
    });
  });

  it('should handle multiple execution timing as expected.', () => {
    const TIME = 100;

    const states = {
      a: { ran: false, resolved: false },
      b: { ran: false, resolved: false },
    };

    async function asyncFunction(execution: keyof typeof states) {
      states[execution].ran = true;
    }

    const debounced = debouncie(asyncFunction, { debounce: TIME });

    const promises = {
      a: debounced('a'),
      b: debounced('b'),
    };
    
    (['a', 'b'] as const).forEach((key) => {
      promises[key].then(() => {
        expect(states[key].resolved).to.be.false;
        states[key].resolved = true;
      });

      expect(states[key].ran).to.be.false;
    });
  
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(states.a.ran).to.be.false;
        expect(states.b.ran).to.be.true;
        expect(states.a.resolved).to.be.true;
        expect(states.b.resolved).to.be.true;
        resolve();
      }, TIME + 50);
    });
  });

  it('should handle multiple execution promises as expected', () => {
    const TIME = 100;

    const states = {
      a: { ran: false, resolved: false },
      b: { ran: false, resolved: false },
      c: { ran: false, resolved: false },
    };

    async function asyncFunction(execution: keyof typeof states) {
      states[execution].ran = true;
    }

    const debounced = debouncie(asyncFunction, { debounce: TIME });

    const promises = {
      a: debounced('a'),
      b: debounced('b'),
    };
    
    expect(promises.a).to.equal(promises.b);
  
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const promise = debounced('c');

        promise.then(() => states.c.resolved = true);
        expect(promise).to.not.equal(promises.a);
        expect(promise).to.not.equal(promises.b);
        expect(states.c.ran).to.be.false;
        expect(states.c.resolved).to.be.false;

        expect(states.a.ran).to.be.false;
        expect(states.b.ran).to.be.true;
      }, TIME + 50);

      setTimeout(() => {
        expect(states.c.resolved).to.be.true;
        resolve();
      }, TIME + TIME + 100);
    });
  });
});
