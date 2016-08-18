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
  Handlebars.registerHelper({
    eq: function (v1, v2) {
        return v1 === v2;
    },
    ne: function (v1, v2) {
        return v1 !== v2;
    },
    eqv: function (v1, v2) {
        return v1 == v2;
    },
    nev: function (v1, v2) {
        return v1 != v2;
    },
    lt: function (v1, v2) {
        return v1 < v2;
    },
    gt: function (v1, v2) {
        return v1 > v2;
    },
    lte: function (v1, v2) {
        return v1 <= v2;
    },
    gte: function (v1, v2) {
        return v1 >= v2;
    },
    and: function (v1, v2) {
        return v1 && v2;
    },
    or: function (v1, v2) {
        return v1 || v2;
    }
  });
}
registerHandlebarHelpers();

var engines = {
  noop: {
    engine: {},
    compile: function (template) {return function(context){return template};},
    process: function (template, context) {return template(context);}
  },
  hbs: {
    engine: require('handlebars'),
    compile: function (template) {return require('handlebars').compile(template);},
    process: function (template, context) {return template(context);}
  }
}
var compiledTemplates = {

}

module.exports = {
  engine: function (key) {
    return engines[key] || engines.noop;
  },
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
