"use strict";

var crypto = require('crypto');
var chance = new require('chance')();
var faker = require('faker');
var cannedUtils = require('./utils')

function registerHandlebarHelpers() {
  var Handlebars = require('handlebars');
  for (var prop in chance) {
    if(typeof chance[prop] === 'function'){
      Handlebars.registerHelper("chance_"+prop, function(context, options) {
        options = options || context;
        var result = chance[this](options.hash);
        return String(result);
      }.bind(""+prop));
    }
  }
  Handlebars.registerHelper("stringify", function(context, options) {
    return JSON.stringify(context);
  });
}
registerHandlebarHelpers();

var engines = {
  noop: {
    compile: function (template) {return function(context){return template};},
    process: function (template, context) {return template(context);}
  },
  hbs: {
    compile: function (template) {return require('handlebars').compile(template);},
    process: function (template, context) {return template(context);}
  }
}
var compiledTemplates = {

}

module.exports = {
  process: function process (key, template, type, context) {
    console.log(key, type, context);
    var hash = crypto.createHash('md5').update(template).digest('hex');

    var compiled = compiledTemplates[type] && compiledTemplates[type][key] && compiledTemplates[type][key][hash];

    if(!compiled) {
      compiledTemplates[type] = compiledTemplates[type] || {};
      compiledTemplates[type][key] = compiledTemplates[type][key] || {};
      compiled = compiledTemplates[type][key][hash] = (engines[type] || engines.noop).compile(template);
    }

    console.log((engines[type] || engines.noop).process(compiled, cannedUtils.extend({}, context, {faker: faker, chance: chance})));

    return (engines[type] || engines.noop).process(compiled, cannedUtils.extend({}, context, {faker: faker, chance: chance}));
  }
}
