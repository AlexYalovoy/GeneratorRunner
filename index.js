function runner(iterator) {
  // Wrap desirable value in promise for same behavior
  function getDesirableValue(value) {
    if (value instanceof Promise) {
      return value;
    } else if (value instanceof Function) {
      return Promise.resolve(value());
    } else {
      return Promise.resolve(value);
    }
  }

  return new Promise( (resolve) => {
    const resultArr = [];

    // Called for each iterator value
    (function handleNextValue(yieldValue) {
      const next = iterator.next(yieldValue);
  
      if (!next.done) {
        getDesirableValue(next.value).then( v => {
            resultArr.push(v);
            handleNextValue(v);
          }, v => {
            resultArr.push(v);
            handleNextValue(v);
          });
      } else {
          resolve(resultArr);
      }
    })();
  });
}

function sum(a, b) {
  return a + b;
};

const prom = new Promise((resolve, reject) => {
  setTimeout( () => {
    if (Math.random() > 0.5) {
      resolve(10);
    } else {
      reject(10);
    }
  }, 1000)
});

const val = 20;
const val2 = { name: 'Ivan' };

function *gen() {
  const a = yield () => sum(1,2);
  const b = yield prom;
  const c = yield val;
  const d = yield val2;
}


runner(gen()).then(console.log)