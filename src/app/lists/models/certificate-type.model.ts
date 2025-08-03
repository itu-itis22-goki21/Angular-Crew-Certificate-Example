import { Certificate } from "./certificate.model";

export interface CertificateType{
  name:string;
  description:string;
  certificates: Certificate[];
}