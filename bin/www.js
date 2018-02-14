#!/usr/bin/env node

// Importing needed modules
import cluster from 'cluster'
import os from 'os'

// Setting needed constants
const CPUs = os.cpus()
const numCPUs = CPUs.length

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
    })
} else {
    const app = require('../app')
}