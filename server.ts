import express from 'express'
import receiptRoutes from './routers/receipt'

export const app = express()

app.use(express.json())

// Use the receipt routes
app.use(receiptRoutes)



