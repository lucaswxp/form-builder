var BooleanEntry = require('./BooleanEntry');

function Radio(attributes, form) {
    BooleanEntry.call(this, attributes, form);
    
    this.attr('type', 'radio');
}

Radio.prototype = Object.create(BooleanEntry.prototype);

module.exports = Radio;