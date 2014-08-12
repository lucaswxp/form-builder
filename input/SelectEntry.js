var AbstractEntry = require('../input/AbstractEntry'),
    HtmlElement = require('../html/HtmlElement');

function Select(form) {
    var options = {},
        optionsHtml = [],
        emptyLabel = undefined;
    
    AbstractEntry.call(this, form);
    
    this.optionsHtml = [];
    
    this.setTagName('select');
}

Select.prototype = Object.create(AbstractEntry.prototype);

Select.prototype.setData = function(values){
    if (!(values instanceof Array)) {
        values = [values];
    }
    
    for (var i in this.optionsHtml) {
        values = values.map(String); // everything to string
        
        this.optionsHtml[i].attr('selected', values.indexOf(this.optionsHtml[i].attr('value')) !== -1);
    }
    
    return this;
}

Select.prototype.setOptions = function(opts){
    this.options = opts;
    
    for (var i in opts) {
        this.optionsHtml.push((new HtmlElement('option')).attr('value', i).text(opts[i]));
    }
    
    return this;
}

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
}


Select.prototype.setEmpty = function(label, value){
    if (label instanceof HtmlElement) {
        this.empty = label;
    }else{
        if (value === undefined) {
            value = '';
        }
        this.empty = (new HtmlElement('option')).attr('value', value).text(label)
    }
    
    return this;
}

module.exports = Select;