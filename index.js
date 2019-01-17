function getDesirableValue(value) {
  if (value instanceof Function) {
    let result = null;
    try {
      result = value();
    } catch(err) {
      return Promise.reject(err);
    }
    return Promise.resolve(result);
  }

  return Promise.resolve(value);
}

function runner(iterator) {

  function handleNextValue(yieldValue, resultArr = []) {
    const {value, done} = iterator.next(yieldValue);
    // console.log(resultArr)
    if (!done) {
      return getDesirableValue(value)
        .then( v => {
          resultArr.push(v);
          return handleNextValue(v, resultArr);
        }, v => {
          resultArr.push(v);
          return handleNextValue(v, resultArr);
        });
    }
    
    return Promise.resolve(resultArr);
  };
  return handleNextValue();
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