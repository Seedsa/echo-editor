/**
 * Standalone Express Application
 * for vercel serverless functions
 */

import express from 'express'
import type { Express } from 'express'
import hello from './hellow'

const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
export default express().use('/api', hello)
