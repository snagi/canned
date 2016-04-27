"use strict";

var crypto = require('crypto');

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
    var hash = crypto.createHash('md5').update(data).digest('hex');

    var compiled = compiledTemplates[type] && compiledTemplates[type][key] && compiledTemplates[type][key][hash];

    if(!compiled) {
      compiledTemplates[type] = compiledTemplates[type] || {};
      compiledTemplates[type][key] = compiledTemplates[type][key] || {};
      compiled = compiledTemplates[type][key][hash] = (engines[type] || engines.noop).compile(template);
    }

    return (engines[type] || engines.noop).process(compiled, context);
  }
}
