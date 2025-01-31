import Receipt from '../../dtos/create-receipt'
import ReceiptProcess from '../../models/receipt-processor'

describe('ReceiptProcessor', () => {
    let processor: ReceiptProcess;

    beforeEach(() => {
        processor = new ReceiptProcess()
    })

    it('processReceipt should process a valid receipt and return an ID', () => {

        const receipt: Receipt = {
            "retailer": "M&M Corner Market",
            "purchaseDate": "2022-03-20",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }

        const id = processor.processReceipt(receipt)
       
        expect(id).toBeDefined()
        expect(typeof id).toBe('string')
    })

  it('getPoints should return correct points for a valid receipt ID', () => {
      
    const receipt: Receipt = {
      "retailer": "M&M Corner Market",
      "purchaseDate": "2022-03-20",
      "purchaseTime": "14:33",
      "items": [
        {
          "shortDescription": "Gatorade",
          "price": "2.25"
        },{
          "shortDescription": "Gatorade",
          "price": "2.25"
        },{
          "shortDescription": "Gatorade",
          "price": "2.25"
        },{
          "shortDescription": "Gatorade",
          "price": "2.25"
        }
      ],
      "total": "9.00"
  }
        const id = processor.processReceipt(receipt)

        const points = processor.getPoints(id)

        expect(typeof points).toBe('number')

    })

    it('getPoints should return null for an invalid receipt ID', () => {
        const id = 'abc'

        const points = processor.getPoints(id)

        expect(points).toBeNull()
    })

    it('generateUUID should return a ID', () => {

        const generateID = processor.generateID()

      expect(typeof generateID).toBe('string')
      expect(generateID).toMatch(/[0-9a-fA-F-]{36}/); 
    })

    it('calculatePoints should calculate points correctly for a given receipt', () => {
        const receipt: Receipt = {
            "retailer": "M&M Corner Market",
            "purchaseDate": "2022-03-20",
            "purchaseTime": "14:33",
            "items": [
              {
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              },{
                "shortDescription": "Gatorade",
                "price": "2.25"
              }
            ],
            "total": "9.00"
        }

        const points = processor.calculatePoints(receipt)

        expect(points).toBe(109)
    })
})

