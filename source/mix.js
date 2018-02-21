const Verify   = require('laravel-mix/src/Verify');
const notifier = require('node-notifier');
const glob     = require('glob');

function pug(src, dest, options) {

    Verify.dependency('pug', ['pug'], true);
        
    let files = glob.sync(src);

    let mixTask = require('./mixTask');

    Mix.addTask(new mixTask({ 
        files, dest, options 
    }));

    return this;
 }

 module.exports = pug;