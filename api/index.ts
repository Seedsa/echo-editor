/**
 * Standalone Express Application
 * for vercel serverless functions
 */

import express from 'express'
import type { Express } from 'express'
import helloApp from './hello'

const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helloApp)
export default express().use('/api', app)
