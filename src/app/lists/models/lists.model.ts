import { Certificate } from "./certificate.model";


export interface Member{
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  title: string;
  daysOnBoard: string;
  dailyRate:number;
  currency:string;
  discount?: number;
  totalIncome:number;
  certificates: Certificate[]|null;

}