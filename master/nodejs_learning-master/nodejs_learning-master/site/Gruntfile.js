module.exports = function (grunt) {

    // configuration
    grunt.initConfig({
        // compress js files
        uglify: {
            options: {
                mangle: true,
                compress: true
            },
            production: {
                src: "public/app/app.js",
                dest: "build/app/app.js"
            }
        }
    });

    
    // load Tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
};