form-builder
============

A node js library for building forms and form elements

Basics
============

Basically you create a Form object and start adding fields to it, see a simple example:

```javascript
var Form = require('form-builder').Form;

// creates my form with some data for the inputs
var myForm = Form.create({action: '/signup', class: 'myform-class'}, {
    user: {firstName: 'Lucas', lastName: 'Pelegrino', email: 'my@email.com'}
});

// opens the form 
myForm.open(); // will return: <form action="/signup" class="myform-class">

// add the first field and renders it
myForm.text().attr('name', 'user[firstName]').render(); // will return: <input type="text" name="user[firstName]" value="Lucas" />

// add the last name field and renders it
myForm.text().attr('name', 'user[lastName]').render(); // will return: <input type="text" name="user[lastName]" value="Pelegrino" />

// add the email field and renders it
myForm.email().attr('name', 'user[email]').render(); // will return: <input type="email" name="user[email]" value="my@email.com" />

// closes form
myForm.end(); // returns </form>
```

Mixing with HTML
============

The `myForm` object acts as a factory object for creating and configuring fields. The form and form elements itself have no restrictions on where to be rendered, you can
just call '.render()' wherever you would like to display the html object as string.

*Observation:* Calling `toString()` method is the same as caling `.render()`

```javascript
<%
var Form = require('form-builder').Form,
    myForm = Form.create({action: '/signup', class: 'myform-class'}, {
        user: {username: 'dummyUser', password: 'mysecret', remember: true} // this will populate the form with some data
    });
%>
    
<h1>User login</h1>

<!-- open form tag -->
<%- myForm.open() ->

<label>
    Username
    <%- myForm.text().attr({name: 'user[username]', placeholder: 'Login', required: true}) %> <!-- output: <input type="text" name="user[username]" value="dummyUser" required="required" /> -->
</label>

<label>
    Password
    <%- myForm.password().attr({name: 'user[password]', placeholder: 'Password', required: true}) %> <!-- output: <input type="password" name="user[password]" value="dummyUser" required="required" /> -->
</label>

<label>
    <%- myForm.checkbox().attr('name', 'user[remember]') %> <!-- output: <input type="checkbox" name="user[remember]" value="1" checked="checked" /> -->
    Remember me
</label>

<!-- closes form tag -->
<%- myForm.end() %>
```

Constructing forms
============
`Form.create(attributes, formData)`

By default, the `{formData}` will overwrite any inline specific value you set to the input. This is great for settings default values and then overwriting them if necessary:

Form without data:

```javascript
var Form = require('form-builder').Form;

// creates the form with no data
var myForm = Form.create({action: '/signup'});


myForm.text().attr('name', 'username').setDefault('myuser name').render(); // <input type="text" name="username" value="myuser name" />

myForm.radio().attr({name: 'newsletter', value: 'yes'}).setDefault().render(); // <input type="radio" name="newsletter" value="yes" checked="checked" />

myForm.radio().attr({name: 'newsletter', value: 'yes_once_per_month'}).render(); // <input type="radio" name="newsletter" value="yes_once_per_month" />

myForm.radio().attr({name: 'newsletter', value: 'never'}).render(); // <input type="radio" name="newsletter" value="never" />
```
Every input has a .setDefault() method.

Now we can populate our form with non default values, overwriting the ones we have created before:

```javascript
var Form = require('form-builder').Form;

// creates the form with some data
var myForm = Form.create({action: '/signup'}, {
    username: 'coolName',
    newsletter: 'yes_once_per_month'
});

myForm.text().attr('name', 'username').setDefault('myuser name').render(); // <input type="text" name="username" value="coolName" />

myForm.radio().attr({name: 'newsletter', value: 'yes'}).setDefault().render(); // <input type="radio" name="newsletter" value="yes" />
myForm.radio().attr({name: 'newsletter', value: 'yes_once_per_month'}).render(); // <input type="radio" name="newsletter" value="yes_once_per_month" checked="checked" />
myForm.radio().attr({name: 'newsletter', value: 'never'}).render(); // <input type="radio" name="newsletter" value="never" />
```

Events
============
Before any input is rendered, the `Form` object will emit a `beforeRenderInput` event passing the input as parameter. That way you can easily configure some attributes in the scope of the form.

For instance, if you wish to add a class to all fields of type text in a form:

```javascript
var Form = require('form-builder').Form;

// creates the form
var myForm = Form.create({action: '/signup'});

myForm.on('beforeRenderInput', function(input){
    if(input.attr('type') == 'text') input.attr('class', 'text-field');
})

myForm.text().attr('name', 'username').setDefault('myuser name').render(); // <input type="text" name="username" value="myuser name" class="text-field" />

myForm.radio().attr({name: 'newsletter', value: 'yes'}).render(); // <input type="radio" name="newsletter" value="yes" />

myForm.radio().attr({name: 'newsletter', value: 'yes_once_per_month'}).render(); // <input type="radio" name="newsletter" value="yes_once_per_month" />

myForm.radio().attr({name: 'newsletter', value: 'never'}).render(); // <input type="radio" name="newsletter" value="never" />
```

Input types
============
form-builder provides support for several input types, you can create any html5 input using the type as a method of the form object (e.g: myForm.textarea()).
The library also provide functionality to easily manage some of the most complex inputs, like selects, checkboxes and radio.

See:

```javascript
var Form = require('form-builder').Form;

// creates the form
var myForm = Form.create({action: '/signup'}, {
    country: ['br', 'at'], // the options with 'br' and 'at' values will be checked
    checklist: [0, 2], // zero-based: the first and the third checkboxes are checked
    favoriteBands: ['metallica', 'snakepit']
});

// a select tag
myForm.select()
    .attr({name: 'country[]', multiple: true})
    .setOptions({br: 'Brazil', at: 'Austria', de: 'Germany'})
    .setEmpty('- select a country -')
    .render();
/*
will return:

<select name="country[]" multiple="multiple" class="input-field">
    <option value="">- select a country -</option>
    <option value="br" selected="selected">Brazil</option>
    <option value="at" selected="selected">Austria</option>
    <option value="de">Germany</option>
</select>
*/


// a group of checkboxes, the formBuilder automatically transform "checklist[]" into "checklist[INDEX]", you  can use your own INDEX without problem, see example bellow
myForm.checkbox().attr({name: 'checklist[]'}).render(); // <input type="checkbox" value="1" name="checklist[0]" checked="checked" />

myForm.checkbox().attr({name: 'checklist[]'}).render(); // <input type="checkbox" value="1" name="checklist[1]" />

myForm.checkbox().attr({name: 'checklist[]'}).render(); // <input type="checkbox" value="1" name="checklist[2]" checked="checked" />


// another group of checkboxes, using indexes
myForm.checkbox().attr({name: 'favoriteBands[metallica]'}).render(); // <input type="checkbox" value="1" name="favoriteBands[metallica]" checked="checked" />

myForm.checkbox().attr({name: 'favoriteBands[soad]'}).render(); // <input type="checkbox" value="1" name="favoriteBands[soad]" />

myForm.checkbox().attr({name: 'favoriteBands[snakepit]'}).render(); // <input type="checkbox" value="1" name="favoriteBands[snakepit]" checked="checked" />
```

The default behavior with form-builder regarding checkboxes is AWALYS set the value attribute to 1/true and let the index of the name tell which option is which, as seen on the examples above.

If you with to set a checkbox as default selected, just call .setDefault() to it before rendering and the rest leave to us.

Roadmap
============
* Better documentation
* Better tests
* Allow optgroups in selects
* Values filters
* Show errors
