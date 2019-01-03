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