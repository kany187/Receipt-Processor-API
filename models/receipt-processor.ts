import { v4 as uuidv4 } from 'uuid';
import Receipt from '../dtos/create-receipt'

// Class that process a receipt
export default class ReceiptProcessor {

    receipt: Map<string, { receipt: Receipt; points: number }>;

    constructor() {
        // In memory-storage
        this.receipt = new Map()
    }

    processReceipt(receipt: Receipt): string {

        const id = this.generateID();

        const points = this.calculatePoints(receipt)

        this.receipt.set(id, { receipt, points })
        
        return id
    }

    getPoints(id: string): number | null {
        const entry = this.receipt.get(id);
        return entry ? entry.points : null
    }

    generateID(): string {
        return uuidv4()
    }

    calculatePoints(receipt: Receipt): number {
        let points = 0

        let name = receipt.retailer.replace(/\s/g, '').replace(/[^a-z0-9]/gi, '');
        let total = receipt.total;
        let day = receipt.purchaseDate.slice(-2);
        let time = receipt.purchaseTime;
        let item = receipt.items;
      
      
        // Rule 1: Points for retailer name
        if(name) points += name.length;
      
        // Rule 2: Round dollar amount
         if(total.endsWith('.00')) points += 50;
          
        // Rule 3: Multiple of 0.25
         if(parseFloat(total) % 0.25 === 0) points += 25;
      
        // Rule 4: 5 points for every 2 times
        for(let i = 1; i < item.length; i += 2){
           points += 5;
        }
      
        // Rule 5: Items description length multiple of 3
        for(let i = 1; i < item.length; i++){
          if(item[i].shortDescription.trim().length % 3 === 0){
              points += Math.ceil((parseFloat(item[i].price) * 0.2))
          }
          
        }
        
        // Rule: 10 points if the time is between 2:00pm and 04:00pm
         if (time >= '14:00' && time <= '16:00') points += 10;
        
         // Rule 6: 6 points if the day in the purchase date is odd
         if(parseInt(day) % 2 === 1) points += 6;
        
        return points;
    }
}