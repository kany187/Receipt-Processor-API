import { Router } from 'express'
import { getReceipt, postReceipt } from '../handlers/receipt-handler'

const router = Router()

// Endpoint that accepts a receipt ID and generates the points for that receipt
router.get('/receipts/:id/points', getReceipt);

// Endpoint to post a receipt
router.post('/receipts/process', postReceipt)

export default router;