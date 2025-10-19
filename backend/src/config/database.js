const mongoose = require('mongoose')
const legacyConnect = require('./db.config')

async function connectDatabase () {
    const maybePromise = typeof legacyConnect === 'function' ? legacyConnect() : null
    if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise
    }
    return mongoose.connection
}

function isConnected () {
    return mongoose.connection.readyState === 1
}

async function disconnectDatabase () {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect()
    }
}

module.exports = Object.assign(connectDatabase, {
    connect: connectDatabase,
    disconnect: disconnectDatabase,
    isConnected
})