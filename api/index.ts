/**
 * Standalone Express Application
 * for vercel serverless functions
 */

import express from 'express'
import type { Express } from 'express'

const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.send('Hello World!')
})
export default express().use('/api', app)
