var path = require('path'),
    fs = require('fs'),
    webpack = require('webpack');

const ignoreModules = fs.readdirSync('./node_modules').filter(d => d != '.bin');
function ignoreNodeModules(context, request, callback){
    if (request[0] == '.')
        return callback();
    const modules = request.split('/')[0];
    if (ignoreModules.indexOf(modules) !== -1)
        return callback(null, 'commonjs ' + request);
    return callback();
}

var createConfig = function(isDebug){
    const plugins = [];
    if(!isDebug){
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }
    //WEBPACK CONFIG
    return {
        target: 'node',
        devtool: 'source-map',
        entry: './src/server/server.js',
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'server.js'
        },
        resolve: {
            alias: {
                shared: path.join(__dirname, 'src', 'shared')
            }
        },
        module: {
            loaders: [
                {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
                {test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/}
            ]
        },
        externals: [ignoreNodeModules],
        plugins: plugins
    };
};
module.exports = createConfig(true);
module.exports.create = createConfig;
