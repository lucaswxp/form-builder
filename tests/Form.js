var assert = require('assert'),
    vows = require('vows'),
    Form = require('../index').Form,
    tag = require('../index').HtmlElement;
    

vows.describe('test form')
    .addBatch({
        'without being filled with data': {
            topic: function(){
                var form = new Form({action: 'signup', class: 'form'});
                form.on('beforeRenderInput', function(input){
                    input.attr('class', (input.attr('class') ? input.attr('class') + ' ' : '') + 'input-field');    
                })
                return form;
            },
            'renders open tag correcly': function(form){
                assert.equal('<form action="signup" class="form">', form.open());
            },
            'renders end tag correcly': function(form){
                assert.equal('</form>', form.end());
            },
            'renders text': function(form){
                assert.equal('<input type="text" name="firstName" value="Lucas" class="input-field" />', form.text().attr({name: 'firstName'}).setDefault('Lucas').render());
            },
            'renders textarea': function(form){
                assert.equal('<textarea name="bio" class="textarea input-field">Awesome</textarea>', form.textarea().attr({name: 'bio', class: 'textarea'}).setDefault('Awesome').render());
            },
            'renders radiogroup': function(form){
                assert.equal('<input type="radio" name="favoriteBand" value="Metallica" class="input-field" />', form.radio().attr({name: 'favoriteBand', value: 'Metallica'}).render());
                assert.equal('<input type="radio" name="favoriteBand" value="SOAD" checked="checked" class="input-field" />', form.radio().attr({name: 'favoriteBand', value: 'SOAD'}).setDefault().render());
            },
            'renders checkbox': function(form){
                assert.equal('<div><input type="checkbox" value="1" name="todo[cleanHouse]" class="input-field" /></div>', form.checkbox().setWrapper(tag.create('div')).attr({name: 'todo[cleanHouse]'}).render());
                assert.equal('<input type="checkbox" value="1" name="todo[goToWork]" checked="checked" class="input-field" />', form.checkbox().attr({name: 'todo[goToWork]'}).setDefault().render());
            },
            'renders indexed checkboxes': function(form){
                assert.equal('<input type="checkbox" value="1" name="list[0]" class="input-field" />', form.checkbox().attr({name: 'list[]'}).render());
                assert.equal('<input type="checkbox" value="1" name="list[1]" class="input-field" />', form.checkbox().attr({name: 'list[1]'}).render());
                assert.equal('<input type="checkbox" value="1" name="list[2]" class="input-field" />', form.checkbox().attr({name: 'list[]'}).render());
            },
            'renders select': function(form){
                
                assert.equal('<select name="country[]" multiple="multiple" class="input-field">' + "\n" +
                                '<option value="">- select a country -</option>' + "\n" +
                                '<option value="br" selected="selected">Brazil</option>' + "\n" +
                                '<option value="at">Austria</option>' + "\n" +
                                '<option value="de" selected="selected">Germany</option>' + "\n" +
                            '</select>', form.select()
                                            .attr({name: 'country[]', multiple: true})
                                            .setOptions({br: 'Brazil', at: 'Austria', de: 'Germany'})
                                            .setDefault(['br', 'de'])
                                            .setEmpty('- select a country -')
                                            .render())
            }
        },
        'filling the form with user provided data': {
            topic: function(){
                var form = new Form({action: 'signup', class: 'form'}, {
                    firstName: 'Lucas Pelegrino',
                    bio: 'Say my name',
                    favoriteBand: 'Metallica',
                    todo: ['cleanHouse'],
                    list: {0: true, 2: true}, // or just [0, 2]
                    country: {'br': true, 'at': true}
                });
                form.on('beforeRenderInput', function(input){
                    input.attr('class', (input.attr('class') ? input.attr('class') + ' ' : '') + 'input-field');    
                })
                return form;
            },
            'renders open tag correcly': function(form){
                assert.equal('<form action="signup" class="form">', form.open());
            },
            'renders end tag correcly': function(form){
                assert.equal('</form>', form.end());
            },
            'renders text': function(form){
                assert.equal('<input type="text" name="firstName" value="Lucas Pelegrino" class="input-field" />', form.text().attr({name: 'firstName'}).setDefault('Lucas').render());
            },
            'renders textarea': function(form){
                assert.equal('<textarea name="bio" class="textarea input-field">Say my name</textarea>', form.textarea().attr({name: 'bio', class: 'textarea'}).setDefault('Awesome').render());
            },
            'renders radiogroup': function(form){
                assert.equal('<input type="radio" name="favoriteBand" value="Metallica" checked="checked" class="input-field" />', form.radio().attr({name: 'favoriteBand', value: 'Metallica'}).render());
                assert.equal('<input type="radio" name="favoriteBand" value="SOAD" class="input-field" />', form.radio().attr({name: 'favoriteBand', value: 'SOAD'}).setDefault().render());
            },
            'renders checkbox': function(form){
                assert.equal('<input type="checkbox" value="1" name="todo[cleanHouse]" checked="checked" class="input-field" />', form.checkbox().attr({name: 'todo[cleanHouse]'}).render());
                assert.equal('<input type="checkbox" value="1" name="todo[goToWork]" class="input-field" />', form.checkbox().attr({name: 'todo[goToWork]'}).setDefault().render());
            },
            'renders indexed checkboxes': function(form){
                assert.equal('<input type="checkbox" value="1" name="list[0]" checked="checked" class="input-field" />', form.checkbox().attr({name: 'list[]'}).render());
                assert.equal('<input type="checkbox" value="1" name="list[1]" class="input-field" />', form.checkbox().attr({name: 'list[1]'}).render());
                assert.equal('<input type="checkbox" value="1" name="list[2]" checked="checked" class="input-field" />', form.checkbox().attr({name: 'list[]'}).render());
            },
            'renders select': function(form){
                
                assert.equal('<select name="country[]" multiple="multiple" class="input-field">' + "\n" +
                                '<option value="">- select a country -</option>' + "\n" +
                                '<option value="br" selected="selected">Brazil</option>' + "\n" +
                                '<option value="at" selected="selected">Austria</option>' + "\n" +
                                '<option value="de">Germany</option>' + "\n" +
                            '</select>', form.select()
                                            .attr({name: 'country[]', multiple: true})
                                            .setOptions({br: 'Brazil', at: 'Austria', de: 'Germany'})
                                            .setDefault(['br', 'de'])
                                            .setEmpty('- select a country -')
                                            .render())
            }
        },
        'wrapping form with a default input wrapper': {
            topic: function(){
                var form = new Form({action: 'signup', class: 'form'});
                form.setInputWrapper(tag.create('div', {'class': 'control'}))
                return form;
            },
            'renders text': function(form){
                assert.equal('<div class="control"><input type="text" name="firstName" value="Lucas" /></div>', form.text().attr({name: 'firstName'}).setDefault('Lucas').render());
            },
            'renders textarea': function(form){
                assert.equal('<div class="control"><textarea name="bio" class="textarea">Awesome</textarea></div>', form.textarea().attr({name: 'bio', class: 'textarea'}).setDefault('Awesome').render());
            }
        },
        'rendering inputs with alternative param style': {
            topic: function(){
                return new Form();
            },
            'renders text with name as string': function(form){
                assert.equal('<input name="test" type="text" />', form.text('test').render());
            },
            'renders text with name as object': function(form){
                assert.equal('<input name="test" type="text" />', form.text({name: 'test'}).render());
            },
            'renders text with name as string second attr params': function(form){
                assert.equal('<input class="someclass" name="test" type="text" />', form.text('test', {class: 'someclass'}).render());
            }
        },
        'create a html tag with second param as the attr': {
            topic: function() {
                var html = tag.create('div',{'class': 'form-control'});
                return html;
            },
            'renders html': function(html) {
                assert.equal(html.render(),'<div class="form-control"></div>');
            }
        }
    }).run();
