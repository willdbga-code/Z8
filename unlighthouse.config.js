export default {
  site: 'http://localhost:3000',
  urls: [
    '/',
    '/site-principal/',
    '/vendas/',
    '/n95c/'
  ],
  scanner: {
    device: 'mobile',
    throttle: false,
    samples: 1,
  },
  outputPath: '.unlighthouse',
  routerPrefix: '/unlighthouse',
}
