var assert = require('assert'),
    vows = require('vows'),
    HtmlElement = require('../../../../libs/form/html/HtmlElement');

    
vows.describe('fetch page')
    .addBatch({
        'a simple tag': {
            topic: function(){
                var tag = new HtmlElement('a');
                return tag.attr('href', 'http://hi.com?a=b&b=a').html('Link');
            },
            'has no error': function(tag){
                assert.equal('<a href="http://hi.com?a=b&amp;b=a">Link</a>', tag.render());
            },
            'has attribute': function(tag){
                assert.equal('http://hi.com?a=b&b=a', tag.attr('href'));
            },
            'toString works': function(tag){
                assert.equal('<a href="http://hi.com?a=b&amp;b=a">Link</a>', tag + "");
            }
        },
        'a void tag': {
            topic: function(){
                var tag = new HtmlElement('input');
                return tag.attr({name: 'author', type: 'text'});
            },
            'renders ok': function(tag){
                assert.equal('<input name="author" type="text" />', tag.render());
            }
        }
    }).run();
