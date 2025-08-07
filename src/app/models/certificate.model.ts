import { CertificateType } from "./certificate-type.model";

export interface Certificate {
  id: number;
  name:string;
  issueDate?:string;
  expireDate?:string;
  tId:number;
  type:CertificateType;
}