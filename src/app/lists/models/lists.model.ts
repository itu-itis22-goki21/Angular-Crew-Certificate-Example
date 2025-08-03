import { CertificateType } from "./certificate-type.model";


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
  certificateTypes:CertificateType[]|null;
}