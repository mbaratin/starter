"use strict";

var _app = _interopRequireDefault(require("./modules/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  _app.default.run();

  console.log("si ci sono");
});