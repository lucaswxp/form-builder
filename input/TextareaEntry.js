var AbstractEntry = require('../input/AbstractEntry');

function Textarea(attributes, form) {
    AbstractEntry.call(this, attributes, form);
    this.setTagName('textarea');
}

Textarea.prototype = Object.create(AbstractEntry.prototype);

Textarea.prototype.setData = function(value){
    this.text(value);
    return this;
};

module.exports = Textarea;