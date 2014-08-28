var BooleanEntry = require('./BooleanEntry');

function Checkbox(attributes, form) {
    BooleanEntry.call(this, attributes, form);
    
    this.attr('type', 'checkbox');
    this.attr('value', '1');
}

Checkbox.prototype = Object.create(BooleanEntry.prototype);

Checkbox.prototype.getBooleanValue = function(){
    return this.getNormalizedNames().pop();
};

Checkbox.prototype.render = function(){
    var names = this.getNormalizedNames(),
        haveIndex = names.length > 1,
        last = names.pop(),
        holderName = names.join('.');
    
    if (this.form && haveIndex) {
        if (this.form._nameHolder[holderName] === undefined) {
            this.form._nameHolder[holderName] = -1; // creates index based display
        }
        
        if (last === '') {
            names.push(++this.form._nameHolder[holderName]);
        }else if (last.match(/^[0-9]+$/) && last == (this.form._nameHolder[holderName]+1)) {
            names.push(++this.form._nameHolder[holderName]);
        }else{
            names.push(last);
        }
        
        var actualName = names.shift();
        this.attr('name', actualName + '[' + names.join('][') +  ']');
    }
    
    return BooleanEntry.prototype.render.call(this);
};

module.exports = Checkbox;