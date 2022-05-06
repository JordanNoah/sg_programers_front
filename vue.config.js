module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/josue.ubilla/dist'
    : '/josue.ubilla/dist',
  transpileDependencies: [
    'vuetify'
  ]
}
