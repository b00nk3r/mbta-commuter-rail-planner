const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

/**
 * @deprecated Use `./database` instead. This module will be removed in a future release.
 */
const DEPRECATION_MESSAGE = 'config/db.config.js is deprecated; use config/database.js instead'
if (process.env.NODE_ENV !== 'test') {
  try {
    process.emitWarning(DEPRECATION_MESSAGE, { code: 'DEPRECATED_DB_CONFIG', type: 'DeprecationWarning' })
  } catch (_) {
    console.warn(`DeprecationWarning: ${DEPRECATION_MESSAGE}`)
  }
}

module.exports = () => {
    const databaseParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try{
        mongoose.connect(process.env.DB_URL)
        console.log("The backend has connected to the MongoDB database.")
    } catch(error){
        console.log(`${error} could not connect`)
    }
}