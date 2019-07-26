/**
 *
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 *
 */

const mix = require("laravel-mix");
const webpack = require("webpack");

const fs = require("fs"); // i dont know what is it, but mqpacker without this - dont work. Maybe FileSystem?
const mqpacker = require("css-mqpacker"); // combaine all media queries by a groups
const sortCSSmq = require("sort-css-media-queries"); //custom sorting for mqpacker

mix.options({
    processCssUrls: false,
    autoprefixer: false,
    postCss: [
        require("css-mqpacker")({
            sort: sortCSSmq
        }),
        require("autoprefixer")({
            grid: "autoplace",
            remove: true
        })
    ]
});

mix.webpackConfig({
    resolve: {
        extensions: [".js"],
        modules: ["node_modules"],
        
        /**
         * if you have a problem with compiling
         *  - GSAP
         *  - ScrollMagic
         *  - and...
         * Save and do not let God, some jQuery libs
         *
         * remove the relevant comment
         *
         * If you have any other libraries that cause the error, add them in alias`es
         *  or provide in plugins
         */
        alias: {
            /** GSAP */
            // 'TweenLite': 'gsap/src/minified/TweenLite.min.js',
            // 'TweenMax': 'gsap/src/minified/TweenMax.min.js',
            // 'TimelineLite': 'gsap/src/minified/TimelineLite.min.js',
            // 'TimelineMax': 'gsap/src/minified/TimelineMax.min.js',
            
            
            /** ScrollMagic and bridge GSAP */
            // 'ScrollMagic': 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
            // 'animation.gsap': 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
            
            /** and jQuery */
            // 'jQuery': "jquery/dist/jquery.min.js"
        }
    },
    plugins: [
        /** and here jQuery */
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery"
        // })
    ]
});

if (mix.inProduction()) {
    
    mix.options({
        // drop all consoles
        terser: {
            terserOptions: {
                compress: {
                    "drop_console": true
                }
            }
        }
    });
    
    // combine all imported modules and libs to single ECMAScript 2015+ file.
    mix.js("resources/js/app.js", "resources/js/vanilla-app.js");
    mix.js("resources/js/system.js", "resources/js/vanilla-system.js");
    mix.js("resources/js/polyfill.js", "resources/js/vanilla-polyfill.js");
    
    // convert single file into a backwards compatible
    // version of JavaScript in current and older browsers.
    mix.babel("resources/js/vanilla-app.js", "public/js/app.js");
    mix.babel("resources/js/vanilla-system.js", "public/js/system.js");
    mix.babel("resources/js/vanilla-polyfill.js", "public/js/polyfill.js");
    
    mix.then(function () {
        
        let filesToClear = ["resources/js/vanilla-app.js", "resources/js/vanilla-system.js", "resources/js/vanilla-polyfill.js"];
    
        for (let i = 0; i < filesToClear.length; i++) {
            fs.stat(filesToClear[i], function(err, stats) {
                if (stats && stats.isFile()) {
                    fs.unlink(filesToClear[i], (err) => {
                        if (err) throw err;
                        console.log(filesToClear[i] + ' - was deleted');
                    });
                }
            });
        }
        
        
    }); //<-- Will be triggered each time Webpack finishes building.
    
    
} else {
    
    mix.sourceMaps();
    
    //section for development, will not work IE11<, safari 9.1.3<
    mix.js("resources/js/app.js", "public/js/app.js");
    mix.js("resources/js/system.js", "public/js/system.js");
    mix.js("resources/js/polyfill.js", "public/js/polyfill.js");
}

// fonts, images, temporary diresctories
mix.copyDirectory('resources/fonts', 'public/fonts/');
mix.copyDirectory('resources/image', 'public/image/');
mix.copyDirectory('resources/html', 'public/');
// mix.copyDirectory("from", "to");

mix.sass("resources/sass/app.sass", "public/css/app.css");
mix.sass("resources/sass/old-browser.sass", "public/css/old-browser.css");

// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();

// mix.browserSync('name.domain');
