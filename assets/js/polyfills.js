import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'es6-shim'; // Для IE 11
import es6promise from 'es6-promise';
es6promise.polyfill(); // Для IE 11

if (!String.prototype.includes) {
  String.prototype.includes = function (match) {
    return this.indexOf(match) !== -1;
  };
}
if (!Object.values) {
  Object.values = (o) => Object.keys(o).map((k) => o[k]);
}
