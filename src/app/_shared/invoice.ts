export class Invoice {
    InvoiceID: number;
    ClientID: number;
    InvoiceNumComp: string;
    CompanyName: string;
    Attn: string;
    Address: string;
    PurchaseDate: string;
    GST: number;
    Amount: number;
    AmountWord: string;
    PaymentMode: string;
    PaymentTerm: string;
    PaymentDetail: string;
    Status: string;
    StatusDate: string;
    InvoiceItems: InvoiceItem[]
}

export class InvoiceItem {
    InvoiceItemID: number;
    InvoiceID: number;
    ItemNum: number;
    SeasonParkingID: number;
    PeriodFrom: string;
    PeriodTo: string;
    Description: string;
    UnitPrice: number;
    Qty: number;
    Unit: string;
    Discount: string;
    Currency: string;
}