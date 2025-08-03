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
  totalIncome:number;
  certificateTypes:CertificateType[]|null;
}