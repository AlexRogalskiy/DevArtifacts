module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        less: {
            "./dist/main.css": ["./app/**/*.less"]
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: ["./app/**/*.js"]
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['app/**/*.js'],
                // the location of the resulting JS file
                dest: './dist/minimalg.min.js'
            }
        },
        html2js: {
            options: {
                module: 'mg.templates',
                base:'.',
                singleModule: true,
                useStrict: true,
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            main: {
                src: ['app/**/*.tpl.html'],
                dest: 'dist/templates.js'
            }
        },
        watch: {
            files: ["./app/**/*.less", "./app/**/*.js", "./app/**/*.html" ],
            // contcat is for development, uglify is for PROD
            tasks: ["less", "jshint"/*,"uglify"*/, "concat", "html2js" /* "ngmin", "uglify"*/],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html2js');
    //works w/ Snarl on Windows, Growl on Mac OS
    //for some reason it doesn't work with Growl on Windows
    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('default', ['watch']);

};