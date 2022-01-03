module.exports = {
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
            test: /\.(js|jsx)$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /(node_modules|bower_components|build)/,
            use: ['babel-loader']
          },
      ],
    },
  }
  