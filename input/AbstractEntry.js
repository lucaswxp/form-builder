var HtmlElement = require('../html/HtmlElement');

function Entry(attributes, form) {
    HtmlElement.call(this, undefined, attributes);
    
    this.form = (form ? form : null);
    this.inputWrapper = null;
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

Entry.prototype.setWrapper = function(inputWrapper){
    if (!(inputWrapper instanceof HtmlElement)) {
        throw new Error('You must pass a instance of HtmlElement as wrapper');
    }
    
    this.inputWrapper = inputWrapper;
    return this;
};

/**
 *Gets global form wrapper or specific input wrapper.
 */
Entry.prototype.getWrapper = function(){
    var wrapperTag;
    
    if (this.inputWrapper) {
        wrapperTag = this.inputWrapper;
    }else if (this.form && this.form.inputWrapper) {
        wrapperTag = this.form.inputWrapper;
    }
    
    return wrapperTag;
};

/**
 *Default before render callback
 */
Entry.prototype.beforeRender = function(){
    this.fill();
};


Entry.prototype.render = function(){
    var inputHtml, wrapperTag;
    
    this.beforeRender();
    if (this.form) {
        this.form.emit('beforeRenderInput', this);
    }
    
    wrapperTag = this.getWrapper();
    
    inputHtml = HtmlElement.prototype.render.call(this);
    if (wrapperTag) {
        wrapperTag.html(inputHtml);
        return wrapperTag.render();
    }else{
        return inputHtml;
    }
};

/**
 * Decides which value (the default, the user provided, etc) this entry will use when rendered
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
 * Format a string like "user[name][surname]" into a array ['user', 'name', 'surname']
 * @return {Array}
 */
Entry.prototype.getNormalizedNames = function(){
    var boundary = '--*boundary--';

    if(this.attr('name') !== undefined) {
        return this.attr('name').replace(/]\[/g, boundary).replace(/\[/g, boundary).replace(/]/g, '').split(boundary);
    }
    
    
};

module.exports = Entry;