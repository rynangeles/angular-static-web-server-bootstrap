'use strict';

module.exports = function(grunt){
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates'
    });

    grunt.initConfig({
        // Project settings
        yeoman: {
            // configurable paths
            client: 'client',
            dist: 'dist'
        },
        watch: {
            injectJS: {
                files: [
                '<%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).js',
                '!<%= yeoman.client %>/app/app.js'
                ],
                tasks: ['injector:scripts']
            },
            injectCss: {
                files: ['<%= yeoman.client %>/{app,components}/**/*.css'],
                tasks: ['injector:css']
            },
            injectSass: {
                files: ['<%= yeoman.client %>/{app,components}/**/*.{scss,sass}'],
                tasks: ['injector:sass']
            },
            sass: {
                files: ['<%= yeoman.client %>/{app,components}/**/*.{scss,sass}'],
                tasks: ['sass', 'postcss']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                files: ['{.tmp,<%= yeoman.client %>}/{app,components}/**/*.{css,html}', '{.tmp,<%= yeoman.client %>}/{app,components}/**/!(*.spec|*.mock).js', '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'],
                options: {
                    livereload: true
                }
            },
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                dot: true,
                src: [
                    '.tmp',
                    '<%= yeoman.dist %>/!(.git*|.openshift|Procfile)**'
                ]
                }]
            },
            server: '.tmp'
        },
        // Add vendor prefixed styles
        postcss: {
            options: {
                map: true,
                processors: [require('autoprefixer')({browsers: ['last 2 version']})]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/',
                    src: '{,*/}*.css',
                    dest: '.tmp/'
                }]
            }
        },
        // Automatically inject Bower components into the app
        wiredep: {
            options: {
                exclude: [/bootstrap.js/, '/json3/', '/es5-shim/', /font-awesome\.css/, /bootstrap\.css/, /bootstrap-sass-official/]
            },
            client: {
                src: '<%= yeoman.client %>/index.html',
                ignorePath: '<%= yeoman.client %>/',
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.client %>',
                    dest: '<%= yeoman.dist %>/<%= yeoman.client %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'bower_components/**/*',
                        'assets/images/{,*/}*.{webp}',
                        'assets/fonts/**/*',
                        'index.html'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.client %>',
                dest: '.tmp/',
                src: ['{app,components}/**/*.css']
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            pre: ['injector:sass'],
            server: ['sass'],
            dist: ['sass','imagemin']
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: ['<%= yeoman.client %>/index.html'],
            options: {
                dest: '<%= yeoman.dist %>/<%= yeoman.client %>'
            }
        },
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/<%= yeoman.client %>/{,!(bower_components)/**/}*.html'],
            css: ['<%= yeoman.dist %>/<%= yeoman.client %>/!(bower_components){,*/}*.css'],
            js: ['<%= yeoman.dist %>/<%= yeoman.client %>/!(bower_components){,*/}*.js'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>/<%= yeoman.client %>', '<%= yeoman.dist %>/<%= yeoman.client %>/assets/images'],
                // This is so we update image references in our ng-templates
                patterns: {
                    js: [[/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']]
                }
            }
        },
        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.client %>/assets/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
                    dest: '<%= yeoman.dist %>/<%= yeoman.client %>/assets/images'
                }]
            }
        },
        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngAnnotate: {
            dist: {
                files: [{
                expand: true,
                cwd: '.tmp/concat',
                src: '**/*.js',
                dest: '.tmp/concat'
                }]
            }
        },
        // ngtemplates tries to make all angular template into one js file template.
        ngtemplates: {
            options: {
                // This should be the name of your apps angular module
                module: 'macMobieApp',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                usemin: 'app/app.js'
            },
            main: {
                cwd: '<%= yeoman.client %>',
                src: ['{app,components}/**/*.html'],
                dest: '.tmp/templates.js'
            },
            tmp: {
                cwd: '.tmp',
                src: ['{app,components}/**/*.html'],
                dest: '.tmp/tmp-templates.js'
            }
        },
        // Compiles Sass to CSS
        sass: {
            server: {
                options: {
                    compass: false
                },
                files: {'.tmp/app/app.css' : '<%= yeoman.client %>/app/app.scss'}
            }
        },
        injector: {
            options: {},
            // Inject application script files into index.html (doesn't include bower)
            scripts: {
                options: {
                    transform: function(filePath) {
                        var yoClient = grunt.config.get('yeoman.client');
                        filePath = filePath.replace('/' + yoClient + '/', '');
                        filePath = filePath.replace('/.tmp/', '');
                        return '<script src="' + filePath + '"></script>';
                    },
                    sort: function(a, b) {
                        var module = /\.module\.js$/;
                        var aMod = module.test(a);
                        var bMod = module.test(b);
                        // inject *.module.js first
                        return (aMod === bMod) ? 0 : (aMod ? -1 : 1);
                    },
                    starttag: '<!-- injector:js -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {'<%= yeoman.client %>/index.html': ['{.tmp,<%= yeoman.client %>}/{app,components}/**/*.js', '!{.tmp,<%= yeoman.client %>}/app/app.js']}
            },
            // Inject component scss into app.scss
            sass: {
                options: {
                    transform: function(filePath) {
                        var yoClient = grunt.config.get('yeoman.client');
                        filePath = filePath.replace('/' + yoClient + '/app/', '');
                        filePath = filePath.replace('/' + yoClient + '/components/', '../components/');
                        return '@import \'' + filePath + '\';';
                    },
                    starttag: '// injector',
                    endtag: '// endinjector'
                },
                files: {'<%= yeoman.client %>/app/app.scss': ['<%= yeoman.client %>/{app,components}/**/*.{scss,sass}', '!<%= yeoman.client %>/app/app.{scss,sass}']}
            },

            // Inject component css into index.html
            css: {
                options: {
                    transform: function(filePath) {
                        var yoClient = grunt.config.get('yeoman.client');
                        filePath = filePath.replace('/' + yoClient + '/', '');
                        filePath = filePath.replace('/.tmp/', '');
                        return '<link rel="stylesheet" href="' + filePath + '">';
                    },
                    starttag: '<!-- injector:css -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {'<%= yeoman.client %>/index.html': ['<%= yeoman.client %>/{app,components}/**/*.css']}
            }
        },
        livereload: {
            files: [
                '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.{css,html}',
                '{.tmp,<%= yeoman.client %>}/{app,components}/**/!(*.spec|*.mock).js',
                '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
            ],
            options: {
                livereload: true
            }
        },
        connect: {
            client: {
                options: {
                    port: 8080,
                    base: ['<%= yeoman.dist %>', '.tmp'],
                    livereload: true,
                    open:{
                        target: 'http://localhost:<%= connect.client.options.port %>',
                        appName: 'open'
                    }
                }
            },
            dist: {
                options: {
                    port: 3000,
                    base: '<%= yeoman.dist %>/<%= yeoman.client %>',
                    keepalive: true,
                    open:{
                        target: 'http://localhost:<%= connect.dist.options.port %>',
                        appName: 'open'
                    }
                }
            }
        }
    });

    grunt.registerTask('serve', function(target){

        if(target === 'dist'){
            return grunt.task.run(['build', 'connect:dist']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:pre',
            'concurrent:server',
            'injector', 
            'wiredep:client',
            'postcss',
            'connect:client', 
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:pre',
        'concurrent:dist',
        'injector',
        'wiredep:client',
        'useminPrepare',
        'postcss',
        'ngtemplates',
        'concat',
        'ngAnnotate',
        'copy:dist',
	    'uglify',
        'cssmin',
        'usemin'
    ]);


};