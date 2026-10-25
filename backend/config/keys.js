module.exports = {
    MongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bus_app',
    JWTSecret: process.env.JWT_SECRET || 'top_secret'
}
