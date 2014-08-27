var escapeAttr = require('./escape');

function HtmlElement(tagName,attributes) {
    this.isVoid = false;
    this.tagName = tagName;
    this.attributes = {};
    this.innerHTML = '';

    /**
     * If have any attributes create the htmlElement with the attributes
     */
    if(attributes instanceof Object) {
        this.setAttributes(attributes);
    }
}

// set this tag to terminate as <tagname /> and not <tagname><tagname/>
HtmlElement.prototype.setVoid = function(bool){
    this.isVoid = bool;
};

HtmlElement.prototype.setTagName = function(name){
    this.tagName = name;
};

HtmlElement.prototype.getTagName = function(){
    return this.tagName;
};


HtmlElement.prototype.setAttribute = function(name, value){
    if (HtmlElement.boolAttrs.indexOf(name) !== -1) {
        if (value) {
            value = name;
        }else{
            this.unsetAttribute(name);
            return this;
        }
    }
    
    this.attributes[name] = String(value);
    
    return this;
};

// set array of attributes
HtmlElement.prototype.setAttributes = function(attrArray){
    for (var name in attrArray) {
        this.setAttribute(name, attrArray[name]);
    }
    return this;
};

// removes one attribute
HtmlElement.prototype.unsetAttribute = function(name){
    if (this.attributes[name] !== undefined) {
        delete this.attributes[name];
    }
    return this;
};

// get a attribute by name
HtmlElement.prototype.getAttribute = function(name){
    return this.attributes[name] === undefined ? undefined : this.attributes[name];
};

// get all attribute
HtmlElement.prototype.getAttributes = function(){
    return this.attributes;
};

// set the inner html of this tag
HtmlElement.prototype.html = function(html, escape){
    this.innerHTML = html + "";
    
    if (escape) {
        this.innerHTML = escapeAttr(this.innerHTML);
    }
    return this;
};

// set the inner text of this tag
HtmlElement.prototype.text = function(text){
    this.html(text, true);
    return this;
};

// alias for setAttribute/setAttributes/getAttribute/getAttributes
HtmlElement.prototype.attr = function(name, value){
    if (name === undefined) {
        return this.attributes;
    }else if (name instanceof Object) {
        this.setAttributes(name);
    }else if (value === undefined) {
        return this.getAttribute(name);
    }else{
        this.setAttribute(name, value);
    }
    return this;
};

HtmlElement.prototype.render = function(){
    if (!this.tagName) {
        throw new Error('You must specify a tag name');
    }
    
    this.setVoid(HtmlElement.unclosableElements.indexOf(this.tagName) !== -1);
    
    var out = '<' + this.tagName + this._parseAttributes();
    
    if (this.isVoid) {
        return this.renderOpen(true);
    }else{
        return this.renderOpen() + (this.innerHTML === undefined ? '' : this.innerHTML) + this.renderEnd();
    }
    
    return out;
};

HtmlElement.prototype.renderEnd = function(voidTag){
    if (!this.tagName) {
        throw new Error('You must specify a tag name');
    }
    
    return '</' + this.tagName + '>';
};

HtmlElement.prototype.renderOpen = function(voidTag){
    if (!this.tagName) {
        throw new Error('You must specify a tag name');
    }
    
    this.setVoid(HtmlElement.unclosableElements.indexOf(this.tagName) !== -1);
    
    var out = '<' + this.tagName + this._parseAttributes() + (voidTag ? ' />' : '>');
    
    
    return out;
};

HtmlElement.prototype.toString = function(){ return this.render(); };
HtmlElement.prototype._parseAttributes = function() {
    var out = '', name;
    
    for (name in this.attributes) {
        out += ' ' + name + '="' + escapeAttr(this.attributes[name]) + '"';
    }
    
    return out;
};

HtmlElement.create = function(tag,attributes){
    return new HtmlElement(tag,attributes);
};
    
HtmlElement.unclosableElements = ['input', 'img', 'hr', 'br'];
HtmlElement.boolAttrs = ['checked', 'selected', 'multiple', 'disabled', 'readonly', 'required', 'autofocus'];

module.exports = HtmlElement;