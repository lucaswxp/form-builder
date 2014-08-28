var InputEntry = require('./InputEntry');

function BooleanEntry(attributes, form) {
    InputEntry.call(this, attributes, form);
}

BooleanEntry.prototype = Object.create(InputEntry.prototype);

BooleanEntry.prototype.setData = function(value){
    if (typeof value == 'boolean') {
        this.attr('checked', value);
    }else {
        if (typeof value == 'string' || typeof value == 'number') {
            value = [value];
        }
        
        if (value instanceof Array){
            value = value.map(String);// everything to string
            
            this.attr('checked', value.indexOf(this.getBooleanValue()) !== -1);
        }else if (value instanceof Object) {
            this.attr('checked', value[this.getBooleanValue()] === true);
        }else{
            throw new Error('Impossible to fill value with: ' + value);
        }
    }

    return this;
};

// set this checkbox as default checked
BooleanEntry.prototype.setDefault = function(bool){
    this.defaultValue = (bool === undefined ? true : bool);
    return this;
};

BooleanEntry.prototype.getBooleanValue = function(){
    return this.attr('value');
};

module.exports = BooleanEntry;