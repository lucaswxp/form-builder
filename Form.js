var HtmlElement = require('./html/HtmlElement'),
    Input = require('./input'),
    events = require('events');

function Form(attributes, formData) {
    this.setTagName('form');
    this.formData = formData;
    this.formTag = new HtmlElement('form');
    this.inputWrapper = null;
        
    /**
     * Keep inputs in arrays
     */
    this.elements = [];
    
    this._nameHolder = {};
    
    if (attributes !== undefined) {
        this.formTag.attr(attributes);
    }
    
    // mixin
    var emitter = new events.EventEmitter;
    for (var i in emitter) {
        this[i] = emitter[i];
    }
}

Form.prototype = Object.create(HtmlElement.prototype);
Form.prototype.constructor = Form;

/**
 *Creates a input of type {inputType}
 *
 *@param {String} inputType
 * Optional The type of entry you wanna create, for example:
 *- text
 *- checkbox
 *- radio
 *- select
 *
 *@return {Input}
 **/
Form.prototype.input = function(inputType, attributes){
    var input;
    
    if (Input[inputType] !== undefined) {
        input = new Input[inputType](attributes, this);
    }else{
        input = new Input.input(attributes, this);
        
        if (inputType !== undefined) {
            input.attr('type', inputType);
        }
    }

    /**
     * Save the input on array
     */
    this.elements.push(input);

    return input;
};

Form.prototype.getValueFor = function(input){
    if (this.formData && input.attr('name') !== undefined) {
        var names = input.getNormalizedNames(),
            allData = this.getFormData(),
            currentName,
            response = allData,
            isCheckbox = input.attr('type') == 'checkbox', // only checkboxes and select multiples can be multi selectable
            isSelectMultiple = input.getTagName() == 'select' && input.attr('multiple') == 'multiple',
            isMultiSelectable = (isCheckbox || isSelectMultiple);
            
        if (isCheckbox || isSelectMultiple && names.length > 1) {
            names.pop();
        }
        
        while (currentName = names.shift()) {
            if (response[currentName] !== undefined) {
                response = response[currentName];
            }else{
                return undefined;
            }
        }
        return response;
    }
};

Form.prototype.getFormData = function(){
    return this.formData;
};

Form.prototype.setFormData = function(data){
    this.formData = data;
};

Form.prototype.open = function(){
    return this.formTag.renderOpen();
};

Form.prototype.end = function(){
    return this.formTag.renderEnd();
};

/**
 * Input wrapper (frequently used on twitter Bootstrap and others as "form-control")
 *
 * <div class="form-control">
 *    <input type="text" />
 * </div>
 */
Form.prototype.setInputWrapper = function(inputWrapper) {
    if (!(inputWrapper instanceof HtmlElement)) {
        throw new Error('You must pass a instance of HtmlElement as wrapper');
    }
    
    this.inputWrapper = inputWrapper;
};

/**
 * Render all elements
 * @return string Rendered form
 */
Form.prototype.render = function() {
    var rendered = '';

    /**
     * Open form tag
     */
    rendered += this.open();

    /**
     * Render elements
     */
    for(var i in this.elements) {
        rendered += this.elements[i].render();
    }

    /**
     * Close form tag
     */
    rendered += this.end();

    return rendered;
    
};

Form.create = function(attributes, formData){
    return new Form(attributes, formData);
};

Form._dynamiclyCreateType = [
    'textarea',
    'select',
    'radio',
    'checkbox',
    'button',
    'color',
    'date',
    'datetime',
    'datetimeLocal',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week'
];


for (var i in Form._dynamiclyCreateType) {
    (function(typeName){
        Form.prototype[typeName] = function(name, attributes){
            var attributes = (attributes ? attributes : {});
            
            if (name !== undefined) {
                if (name instanceof Object) { // name is actually attributes
                    attributes = name;
                }else{
                    attributes.name = name;
                }   
            }
            
            return this.input(typeName, attributes);
        };
    })(Form._dynamiclyCreateType[i]);
}

module.exports = Form;