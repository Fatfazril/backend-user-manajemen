const mongoose = require('mongoose')
const logger = require('../src/utils/logger')

const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        logger.info('Database Connected')
    } catch (error) {
        logger.info('Database Error : ' , error)
        process.exit(1)
    }
}

module.exports = connectDb