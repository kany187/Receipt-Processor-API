
export interface Item {
    shortDescription: string;
    price: string;
}

export default interface Receipt {
    retailer: string;
    purchaseDate: string;
    purchaseTime: string;
    items: Item[];
    total: string;
}