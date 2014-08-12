var AbstractEntry = require('../input/AbstractEntry');

function Input(form) {
    AbstractEntry.call(this, form);
    this.setTagName('input');
}

Input.prototype = Object.create(AbstractEntry.prototype);

Input.prototype.setData = function(value){
    this.attr('value', value);
    return this;
}

module.exports = Input;