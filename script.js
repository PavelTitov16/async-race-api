let string = "Welcome to this Javascript!";
let array = string.split(' ').map((item) => item.split('').reverse().join('')).join(' ');

console.log(array);

for (var i = 0; i < 5; i++) {
  const id = setTimeout((function(i) {
      console.log(i);
    }).bind(this, i), 1000);
    clearTimeout(id);
  }
  

  Number('111'); 111
Number('111fff'); NaN
Number('fff111'); NaN
Number(' 111 '); 111
Number(' 1 1 1 '); NaN

String.prototype.getLength = function() {
    return this.length;
}


console.log('www'.getLength()); // 3
console.log('e'.getLength()); // 1