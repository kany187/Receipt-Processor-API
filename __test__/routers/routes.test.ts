import { app } from "../../server";
import ReceiptProcess from '../../models/receipt-processor'
import supertest from 'supertest'

describe('Receipt Routes', () => {
    let processor: ReceiptProcess;
    let validReceiptId: string

    beforeEach(async () => {
        processor = new ReceiptProcess()

        const validReceipt = {
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

        const response = await supertest(app)
        .post('/receipts/process')
        .send(validReceipt);
    
        validReceiptId = response.body.id;
    })

    describe('GET /receipts/:id/points', () => {
        it('should return points for a valid receipt ID', async () => {

            const res = await supertest(app)
                .get(`/receipts/${validReceiptId}/points`)
                .expect('Content-Type', /json/)
                .expect(200)
        
            expect(res.status).toBe(200)
            expect(res.body).toEqual({points: expect.any(Number)})
        })

        it('should return 404 for an invalid ID', async () => {
            const invalidId = 'abc';

            const res = await supertest(app)
                .get(`/receipts/${invalidId}/points`)
                .expect('Content-Type', /json/)
                .expect(404);

            expect(res.body).toEqual({
                error: 'No receipt found for that ID.'
            });
        })
    })


    describe('POST /receipts/process', () => {
        it('POST /receipts/process should process a valid receipt', async () => {
            const receipt = {
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
    
            const res = await supertest(app)
                .post('/receipts/process')
                .send(receipt)
                .expect('Content-Type', /json/)
                .expect(200)
    
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('id')
            expect(res.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/) // UUID format
        })
    })
   
})
