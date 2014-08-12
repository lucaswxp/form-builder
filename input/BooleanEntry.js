var InputEntry = require('./InputEntry');

function BooleanEntry(form) {
    InputEntry.call(this, form);
}

BooleanEntry.prototype = Object.create(InputEntry.prototype);

BooleanEntry.prototype.setData = function(value){
    
    if (typeof value == 'boolean') {
        this.attr('checked', value);
    }else {
        if (!(value instanceof Array)){
            value = [value];
        }
        var values = value.map(String); // everything to string
        this.attr('checked', values.indexOf(this.getBooleanValue()) !== -1);
    }

    return this;
}

// set this checkbox as default checked
BooleanEntry.prototype.setDefault = function(bool){
    this.defaultValue = (bool === undefined ? true : bool);
    return this;
}

BooleanEntry.prototype.getBooleanValue = function(){
    return this.attr('value');
}

module.exports = BooleanEntry;