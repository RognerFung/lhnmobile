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

export class Profile {
    ClientID: number;
    Email: string;
    Salutation: string;
    FirstName: string;
    LastName: string;
    NRIC: string;
    CompanyName: string;
    ContactNo: string;
    Fax: string;
    Country: string;
    StreetName: string;
    Block: string;
    UnitNo: string;
    PostalCode: string;
    Website: string;
}

export class Request {
    ChangeRequestID: number;
    ClientID: number;
    RequestDate: Date;
    RequestType: string;
    FromVehicleID: number;
    FromVehicleNum: string;
    FromCashCard: string;
    FromIU: string;
    ToVehicleID: number;
    ToVehicleNum: string;
    ToCashCard: string;
    ToIU: string;
    RequestReason: string;
    PeriodFrom: Date;
    PeriodTo: Date;
    Status: string;
    StatusDate: Date;
}

export class Season {
    SeasonParkingID: number;
    VehicleID: number;
    VehicleNum: string;
    ParkingLotID: number;
    Address: string;
    ClientID: number;
    SeasonType: string;
    PricingType: string;
    PeriodFrom: Date;
    PeriodTo: Date;
    Price: number;
    ApplyGIRO: number;
    GIRODetails: string;
    NumCars: number;
    AddedOn: Date;
    Status: string;
    StatusDate: Date;
}

export class Tenant {
    ClientID: number;
    ParkingLotID: number;
    Address: string;
    VehicleAmount: number;
    TenantFileName: string;
    Status: string;
    StatusDate: Date;
}

export class Vehicle {
    VehicleID: number;
    ClientID: number;
    VehicleNum: string;
    VehicleType: string;
    VehicleTypeID: number;
    IUNum: string;
    CashCardNum: string;
    AddedDate: Date;
    Status: string;
}