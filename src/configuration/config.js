const {log} = require('../services/logger')
module.exports ={
    server : {
        port : process.env.PORT || 4500,
        mongoDb_connection_URL : process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/eduction',
        BASE_URL: process.env.BASE_URL || 'http://localhost:4500/',
        //mongoDb_connection_URL : process.env.MONGODB_URL || 'mongodb+srv://sagar:Sagar@6531@cluster0-b8vly.mongodb.net/college?retryWrites=true&w=majority'
    },
    auth : {
        jwtSecret: process.env.JWTKEY || "robosagar"
    }
}
