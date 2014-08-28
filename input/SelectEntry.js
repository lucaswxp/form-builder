var AbstractEntry = require('../input/AbstractEntry'),
    HtmlElement = require('../html/HtmlElement');

function Select(attributes, form) {
    var options = {},
        optionsHtml = [],
        emptyLabel = null;
    
    AbstractEntry.call(this, attributes, form);
    
    this.optionsHtml = [];
    
    this.setTagName('select');
}

Select.prototype = Object.create(AbstractEntry.prototype);

Select.prototype.setData = function(values){
    if (typeof values == 'string' || typeof values == 'number') {
        values = [values];
    }
    for (var i in this.optionsHtml) {
        var option = this.optionsHtml[i];
        
        if (values instanceof Array){
            values = values.map(String);// everything to string
            
            this.optionsHtml[i].attr('selected', values.indexOf(option.attr('value')) !== -1);
        }else if (values instanceof Object) {
            this.optionsHtml[i].attr('selected', values[option.attr('value')] === true);
        }else{
            throw new Error('Impossible to fill value with: ' + values);
        }
    }
    
    return this;
};

Select.prototype.setOptions = function(opts){
    this.options = opts;
    
    for (var i in opts) {
        this.optionsHtml.push((new HtmlElement('option')).attr('value', i).text(opts[i]));
    }
    
    return this;
};

Select.prototype.beforeRender = function(){
    AbstractEntry.prototype.beforeRender.call(this);
    
    var inner = '';
    
    
    // add empty tag
    if (this.empty) {
        this.optionsHtml.unshift(this.empty);
    }
    
    // add options tag
    for (var i in this.optionsHtml) {
        inner += this.optionsHtml[i].render() + "\n";
    }
    
    this.html("\n" + inner);
};


Select.prototype.setEmpty = function(label, value){
    if (label instanceof HtmlElement) {
        this.empty = label;
    }else{
        if (value === undefined) {
            value = '';
        }
        this.empty = (new HtmlElement('option')).attr('value', value).text(label);
    }
    
    return this;
};

module.exports = Select;