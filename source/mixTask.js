const FileCollection = require('laravel-mix/src/FileCollection');
const File = require('laravel-mix/src/File');
const Task = require('laravel-mix/src/tasks/Task');

const notifier = require('node-notifier');
const glob = require('glob');
const path = require('path');
const pug  = require('pug');
const fs   = require('fs');

class mixTask extends Task {

    /**
     * Run the pug compiler.
     */
    run() {

        let {files, dest, options} = this.data;
        

        // Default options
        const defaults = {
            pretty: true
        }

        // Set destination folder
        this.dest = dest;

        // Options or Set by defaults
        this.options = options || defaults;

        
        // Prepare Template Files
        this.templates = files;

        // We'll be watching for changes on all pug files
        // in case a layout, mixin or partial changes and
        
        this.files = new FileCollection(
            glob.sync('**/*.pug', {ignore: 'node_modules/**/*'}).concat()
        );

        // Preprare destination assets
        this.assets = files.map(asset => this.prepareAssets(asset));

        this.compile();
    }


    /**
     * Compiles a collection of Pug templates.
     *
     */
    compile() {

        this.templates.forEach((template, index) => this.compileTemplate(template, index));

        return this;
    }

    /**
     * Compiles a single pug template
     * 
     * @param {string} src Path to the pug source file
     * @param {number} index
     */
    compileTemplate(src, index) {
        let file = new File(src);
        let output = this.assets[index];

        try {
            
            let template = pug.compileFile(file.path(), this.options);

            let html = template();
        
            fs.writeFileSync(output.path(), html);

            this.onSuccess();

        } catch (e) {
            this.onFail(e.name + ': ' + e.message);
        }
    }



    /**
     * Recompile on change when using watch
     * 
     * @param {string} updatedFile 
     */
    onChange(updatedFile) {
        this.compile();
    }


    /**
     * Handle successful compilation.
     *
     * @param {string} output
     */
    onSuccess(output) {
        if (Config.notifications.onSuccess) {
            notifier.notify({
                title: 'Laravel Mix',
                message: 'Pug Compilation Successful'                
            });
        }
    }


    /**
     * Handle failed compilation.
     *
     * @param {string} output
     */
    onFail(output) {
        console.log("\n");
        console.log('Pug Compilation Failed!');
        console.log();
        console.log(output);

        if (Mix.isUsing('notifications')) {
            notifier.notify({
                title: 'Laravel Mix',
                subtitle: 'Pug Compilation Failed',
                message: output,                
            });
        }
    }

    prepareAssets(src) {
        let file = new File(src);
        let output = path.join(this.dest, file.nameWithoutExtension() + '.html');
        let asset = new File(output);
        
        Mix.addAsset(asset);

        return asset;
    }

}

module.exports = mixTask;