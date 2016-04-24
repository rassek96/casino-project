"use strict";

module.exports = function(total) {
  if(total === 21) {
    return true;
  } else if(total > 21) {
    return false;
  }
}
