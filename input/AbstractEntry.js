var HtmlElement = require('../html/HtmlElement');

function Entry(form) {
    HtmlElement.call(this);
    
    this.form = (form ? form : null);
}

Entry.prototype = Object.create(HtmlElement.prototype);


Entry.prototype.setDefault = function(defaultValue){
    this.defaultValue = defaultValue;
    return this;
};

Entry.prototype.getDefault = function(){
    return this.defaultValue;
};

Entry.prototype.setData = function(val){
    throw new Error('You must subclass the getData() method');
};

/**
 *Default before render callback
 */
Entry.prototype.beforeRender = function(){
    this.fill();
};


Entry.prototype.render = function(){
    this.beforeRender();
    if (this.form) {
        this.form.emit('beforeRenderInput', this);
    }
    return HtmlElement.prototype.render.call(this);
};

/**
 *Decides which value (the default, the user provided, etc) this entry will use when rendered
 */
Entry.prototype.fill = function(){
    var formData = (this.form ? this.form.getValueFor(this) : undefined),
        defaultValue = this.getDefault();
        
    if (formData !== undefined) {
        this.setData(formData);
    }else if(defaultValue !== undefined){
        this.setData(defaultValue);
    }
};


/**
 *Format a string like "user[name][surname]" into a array ['user', 'name', 'surname']
 *
 *@return {Array}
 */
Entry.prototype.getNormalizedNames = function(){
    var boundary = '--*boundary--';
    
    return this.attr('name').replace(/]\[/g, boundary).replace(/\[/g, boundary).replace(/]/g, '').split(boundary);
};

module.exports = Entry;