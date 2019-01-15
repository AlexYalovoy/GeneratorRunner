function runner(iterator) {
    const resultArr = [];
  
    return new Promise( (resolve, reject) => {
      function internalGen(generator, yieldV){
        let next = generator.next(yieldV);
  
        if (!next.done) {
          if (next.value instanceof Promise) {
            next.value.then(
              result => {
                resultArr.push(result);
                internalGen(generator, result)
              },
              result => {
                resultArr.push(result);
                internalGen(generator, result)
              }
            );
          } else if (next.value instanceof Function) {
            resultArr.push(next.value());
            internalGen(generator, next.value())
          } else {
            resultArr.push(next.value);
            internalGen(generator, next.value);
          }
        } else {
          resolve(resultArr);
        }
      }
      internalGen(iterator)
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