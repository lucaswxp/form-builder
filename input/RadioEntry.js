var BooleanEntry = require('./BooleanEntry');

function Radio(form) {
    BooleanEntry.call(this, form);
    
    this.attr('type', 'radio');
}

Radio.prototype = Object.create(BooleanEntry.prototype);

module.exports = Radio;