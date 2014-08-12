var AbstractEntry = require('../input/AbstractEntry');

function Textarea(form) {
    AbstractEntry.call(this, form);
    this.setTagName('textarea');
}

Textarea.prototype = Object.create(AbstractEntry.prototype);

Textarea.prototype.setData = function(value){
    this.text(value);
    return this;
}

module.exports = Textarea;