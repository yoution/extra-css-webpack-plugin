


function ExtractCssWebpackPlugin(options) {}


ExtractCssWebpackPlugin.prototype._processDependenciesBlockForChunk = function(module, chunk) {

     if(module.dependencies) {
        for(var i = 0; i < module.dependencies.length; i++) {
            var dep = module.dependencies[i];
            if(/\.css$/.test(dep.request)) {
                chunk.addModule(dep.module);
                dep.module.addChunk(chunk);
            }else if(dep.module){
                this._processDependenciesBlockForChunk(dep.module, chunk);
            }
        }
    }
    if(module.blocks) {
        for(var i = 0; i < module.blocks.length; i++) {
            var block = module.blocks[i];
            this._processDependenciesBlockForChunk(block, chunk);
            
        }
    }
}

ExtractCssWebpackPlugin.prototype._deleteCssBlockFromChunk = function(module) {
    if(module.dependencies) {
        for(var i = 0; i < module.dependencies.length; i++) {
            var dep = module.dependencies[i];
            if(/\.css$/.test(dep.request)) {
                //dep.module._source._value = '//css'
                //module.dependencies.splice(i, 1);
                //i= i-1;
                //module.dependencies[i] = null;
            }else if(dep.module){
                this._deleteCssBlockFromChunk(dep.module);
            }else {
                
                // module.dependencies.splice(i, 1);
                // i= i-1;
            }
        }
    }

    if(module.blocks) {
        for(var i = 0; i < module.blocks.length; i++) {
            var block = module.blocks[i];
            this._deleteCssBlockFromChunk(block);
        }
    }
}

ExtractCssWebpackPlugin.prototype.apply = function(compiler) {
   var _this = this;

  compiler.plugin("compilation", function(compilation) {

    compilation.plugin("chunk-asset", function(chunk, file) {
        var result = '';
        if(/\.css$/.test(file)) {
            chunk.modules.slice(1).forEach(function(module) {
                result += module._source._value; 
            });
            this.assets[file]._source.children = [result];
        }
    });
    

    compilation.plugin("seal", function() {

        this.preparedChunks.forEach(function(preparedChunk) {
            var module = preparedChunk.module;
            var chunk = this.addChunk(null, module);
            chunk.filenameTemplate = preparedChunk.name+'.css';
            chunk.initial = chunk.entry = true;
            chunk.addModule(module);
            module.addChunk(chunk);
            _this._processDependenciesBlockForChunk(module, chunk);
        }, this)

        this.preparedChunks.forEach(function(preparedChunk) {
            var module = preparedChunk.module;
            _this._deleteCssBlockFromChunk(module); 
        })
    });
    

    compilation.plugin("after-optimize-chunks", function(chunks) {
        
        chunks.forEach(function(chunk) {

            if (/\.css$/.test(chunk.filenameTemplate)) {
                chunk.modules.slice(1).forEach(function(module,idx) {
                    var cloneModule = Object.create(module);
                    cloneModule._source = Object.create(module._source);
                    if (module._source._value) {
                        module._source._value2 = module._source._value;
                        module._source._value  = '';
                    }
                    cloneModule._source._value = module._source._value2;
                    chunk.modules.splice(idx+1, 1, cloneModule);
                });
            } 

        });
    });

  });
};

module.exports = ExtractCssWebpackPlugin;
