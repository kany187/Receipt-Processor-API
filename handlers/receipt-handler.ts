import ReceiptProcessor from "../models/receipt-processor"
import { ReceiptSchema, validateReceipt } from "../models/receiptSchema"

// Initialize the ReceiptProcessor
const processor = new ReceiptProcessor

// Handler to get points for a receipt ID
export const getReceipt = (req: any, res: any) => {
    try {
        const id  = req.params.id

        // Get the points for the receipt from the processor
        const points = processor.getPoints(id)
    
        if (points === null) return res.status(404).json({ error: 'No receipt found for that id.' })
        
        // Return the points for the receipt
        return res.status(200).json({ points })

    } catch (error) {
        
        res.status(500).json({ error: 'Internal server error' })
    }
};

// Handler to process a new receipt
export const postReceipt = (req: any, res: any) => {
    try {

        // Validate the request body
        const validReceipt = validateReceipt(ReceiptSchema, req.body)

        // Process the receipt data using the ReceiptProcessor instance
        const id = processor.processReceipt(validReceipt)

        // Respond with the generated ID
        res.status(200).json({ "id": id })

    } catch (error: unknown) {

        if (error instanceof Error) {
            res.status(400).json({ error: error.message})
        } else {
            res.status(400).json({ error: "Invalid input. Please verify input." })
        }
    }

}