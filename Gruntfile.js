module.exports = function(grunt) {
    "use strict";

    function prepare_for_uglify(code) {
        code = code.replace(/#s\./g, "SCRIPTOR.");
        code = code.replace(/#db\./g, "DATABASE.");
        code = code.replace(/([\s\S]*)/, "($1)();");

        return code;
    }

    function prepare_for_upload(code) {
        code = code.replace(/^\!([\s\S]*)\(\);$/, "$1");
        code = code.replace(/^\(([\s\S]*)\)\(\);$/, "$1");
        code = code.replace(/DATABASE\./g, "#db.");
        code = code.replace(/SCRIPTOR\./g, "#s.");

        return code;
    }

    function calculate_dependencies(required, library) {
        library = library || [];
        var dependencies = {};
        var current;
        var uses = [];
        while (required.length) {
            current = required.shift();
            if (current in dependencies) continue;
            if (library.indexOf(current) > -1) {
                if (uses.indexOf(current) == -1) {
                    uses.push(current);
                }
                continue;
            }
            var source = grunt.file.read("include/" + current + ".js");
            var includes = source.match(/.*INCLUDE\(\w+\).*/g) || [];
            includes = includes.map(function(value) { return value.replace(/.*\((.*)\).*/, "$1"); });
            required = required.concat(includes);
            dependencies[current] = includes;
        }
        var unordered = [];
        for (var key in dependencies) { unordered.push({ 'file': key, 'deps': dependencies[key] }); }
        var ordered = [];
        while (unordered.length) {
            current = unordered.shift();
            var nodeps = true;
            for (var item in current.deps) {
                if (current.deps[item] in dependencies) { nodeps = false; break; }
            }
            if (nodeps) {
                delete dependencies[current.file];
                ordered.push(current.file);
            } else {
                unordered.push(current);
            }
        }

        return [ordered, uses];
    }

    function generate_includes(includes, library) {
        library = library || [];
        var code = "";
        var i;
        if (library.length) {
            code += "var __lib__ = SCRIPTOR." + grunt.config('meta.user') + ".lib();\n";
            for (i in library) {
                code += "var " + library[i] + " = __lib__." + library[i] + ";\n";
            }
        }
        for (i in includes) {
            var file = includes[i];
            var tmp = grunt.file.read("include/" + file + ".js");
            tmp = tmp.replace(/.*INCLUDE\(\w+\).*/g, "");
            code += "var " + file + " = " + tmp + ";\n";
        }
        return code;
    }

    function create_lib() {
        var required = grunt.config('meta.lib');
        if (!required.length) return;
        grunt.log.write('Request library with ').write(required).writeln(' ... ');
        grunt.log.write('Calculating dependencies... ');
        var tmp = calculate_dependencies(required);

        grunt.config('meta.lib', tmp[0]);
        grunt.log.ok();

        required = grunt.config('meta.lib');
        grunt.log.write('Generate library with ').write(required).write(' ... ');

        var code = "function (){\n";
        code += generate_includes(required);
        code += "return {\n";
        for (var i in required) {
            var file = required[i];
            code += file + " : " + file + ",\n";
        }
        code += "};\n}";

        grunt.file.write("build/lib.js", prepare_for_uglify(code));
        grunt.log.ok();
    }

    grunt.initConfig({
        meta: {
            user: grunt.option("user") || "dr_dvorak",
            lib: [].concat(grunt.option("lib") || []),
        },
        clean: {
            build: ["build/"],
            release: ["release/"],
        },
        copy: {
            pre: {
                expand: true,
                flatten: true,
                src: ["tools/*.js", "hacking/*.js", "poc/*.js"],
                dest: "build/",
                options: {
                    process: function(content) {
                        // Determine includes
                        var includes = content.match(/.*INCLUDE\(\w+\).*/g);
                        if (includes) {
                            includes = includes.map(function(value) {
                                return value.replace(/.*\((.*)\).*/, "$1");
                            });
                            var tmp = calculate_dependencies(includes, grunt.config('meta.lib'));
                            includes = generate_includes(tmp[0], tmp[1]);
                            content = content.replace(/.*INCLUDE\(\w+\).*/, includes);
                            content = content.replace(/.*INCLUDE\(\w+\).*/g, "");
                        }

                        // prepare code for linting and uglifing
                        return prepare_for_uglify(content);
                    }
                }
            },
            post: {
                expand: true,
                flatten: true,
                src: ["build/*.js"],
                dest: "release/",
                options: {
                    process: prepare_for_upload
                }
            }
        },
        jshint: {
            files: ["Gruntfile.js", "build/*.js"]
        },
        jsbeautifier: {
            files: ["include/*.js", "tools/*.js", "hacking/*.js", "poc/*.js", "Gruntfile.js",
                "package.json"
            ],
            options: {
                js: {
                    braceStyle: "collapse-preserve-inline",
                    wrapLineLength: 120
                }
            }
        },
        uglify: {
            options: {
                mangle: true,
                compress: true,
                beautify: true
            },
            all: {
                files: [{
                    expand: true,
                    src: "build/*.js",
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jsbeautifier");

    grunt.registerTask('lib', 'Assemble the library', create_lib);

    grunt.registerTask("default", ["dynamic"]);
    grunt.registerTask("dynamic", "build static scripts", ["clean", "jsbeautifier", 'lib', "copy:pre", "jshint",
        "uglify", "copy:post", "clean:build"
    ]);
    grunt.registerTask("static", "build static scripts", ["clean", "jsbeautifier", "copy:pre", "jshint",
        "uglify", "copy:post", "clean:build"
    ]);
};
