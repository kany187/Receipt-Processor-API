import { z } from 'zod'

const ItemSchema = z.object({
    shortDescription: z.string()
        .min(1, "Item description cannot be empty")
        .max(100, "Item description too long")
    ,
    price: z.string()
        .regex(/^\d+\.\d{2}$/, "Price must be in format 'x.xx'")
}) 

export const ReceiptSchema = z.object({
    retailer: z.string()
        .min(1, "Retailer name cannot be empty")
        .max(50, "Retailer name too long"),
    purchaseDate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in format 'YYYY-MM-DD'")
        .refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, "Invalid date"),
    purchaseTime: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in format 'HH:MM' (24-hour)")
        .refine((time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
        }, "Invalid time"),
    items: z.array(ItemSchema)
        .min(1, "Receipt must have at least one item")
        .max(100, "Too many items"),
    total: z.string()
        .regex(/^\d+\.\d{2}$/, "Total must be in format 'x.xx'")
        .refine((total) => {
            return parseFloat(total) >= 0;
        }, "Total cannot be negative")
});

export type ValidReceipt = z.infer<typeof ReceiptSchema>

// Helper function to validate request bpdy
export function validateReceipt(schema: any, body: unknown) {
    const result = schema.safeParse(body);
    if (!result.success) {
        const errorMessages = result.error.errors.map((err: any) => {
            const fieldPath = err.path.join('.');
            return `${fieldPath}: ${err.message}`;
        }).join(', ');
        throw new Error(`Invalid input: ${errorMessages}. Please verify input.`);
      }
      return result.data; 
}
