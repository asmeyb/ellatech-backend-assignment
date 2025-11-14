export default() => ({
    appName: process.env.APP_NAME || 'MYNESTAPP',
    appPort: process.env.APP_PORT || 3000,        
})