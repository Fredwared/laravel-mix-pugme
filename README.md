# laravel-mix-pugme
## Usage

Install this package into your project:

```
npm install laravel-mix-pugme --save-dev
```
Head over to your `webpack.mix.js` and register it on the Laravel Mix API:

```js
let mix = require('laravel-mix');
mix.pug = require('laravel-mix-pugme');
mix.setPublicPath('dist');
mix.js('src/app.js', 'source/to/dist')
   .sass('src/app.scss', 'source/to/dist')
   .pug('src/*.pug', 'source/to/dist', {
      pretty: true,
      debug: false,
      etc
    })
   
```
## Options

## License

Laravel Mix PugME is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
