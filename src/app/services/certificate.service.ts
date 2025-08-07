import { Injectable } from "@angular/core";
import { Certificate } from "../models/certificate.model";
import { CertificateTypeService } from "../services/certificate-type.service";


@Injectable({providedIn:'root'})
export class CertificateService{
  constructor(public certificateTypeService: CertificateTypeService){}

    public CERTIFICATE_DATA: Certificate[] = [
  { id: 1, name: 'STCW Basic Safety Training', issueDate: '2022-03-15', expireDate: '2027-03-14', tId:1, type: this.certificateTypeService.CERTIFICATE_DATA[0]},
  { id: 2, name: 'Proficiency in Survival Craft and Rescue Boats', issueDate: '2021-06-10', expireDate: '2026-06-09', tId:1,type: this.certificateTypeService.CERTIFICATE_DATA[1] },
  { id: 3, name: 'Advanced Fire Fighting', issueDate: '2023-01-05', expireDate: '2028-01-04', tId:1, type: this.certificateTypeService.CERTIFICATE_DATA[2] },
  { id: 4, name: 'Medical First Aid', issueDate: '2020-09-20', expireDate: '2025-09-19', tId:2 , type: this.certificateTypeService.CERTIFICATE_DATA[3]},
  { id: 5, name: 'GMDSS Radio Operator Certificate', issueDate: '2022-11-01', expireDate: '2027-10-31', tId:2 , type: this.certificateTypeService.CERTIFICATE_DATA[0]},
  { id: 6, name: 'Security Awareness', issueDate: '2021-02-14', expireDate: '' , tId:2, type: this.certificateTypeService.CERTIFICATE_DATA[1] }, // No expiry
  { id: 7, name: 'Personal Survival Techniques', issueDate: '2023-04-30', expireDate: '2028-04-29', tId:2, type: this.certificateTypeService.CERTIFICATE_DATA[2] },
  { id: 8, name: 'Personal Safety and Social Responsibilities', issueDate: '2023-05-10', expireDate: '2028-05-09', tId:2, type: this.certificateTypeService.CERTIFICATE_DATA[1] },
  { id: 9, name: 'Oil Tanker Familiarization', issueDate: '2022-08-25', expireDate: '2027-08-24', tId:3 , type: this.certificateTypeService.CERTIFICATE_DATA[3]},
  { id: 10, name: 'Medical Care Onboard Ship', issueDate: '2021-12-18', expireDate: '2026-12-17', tId:3 , type: this.certificateTypeService.CERTIFICATE_DATA[3]},
  { id: 11, name: 'Radar Navigation, Radar Plotting and Use of ARPA', issueDate: '2022-02-22', expireDate: '2027-02-21', tId:4 , type: this.certificateTypeService.CERTIFICATE_DATA[2]},
  { id: 12, name: 'Bridge Resource Management', issueDate: '2023-07-12', expireDate: '2028-07-11', tId:3 , type: this.certificateTypeService.CERTIFICATE_DATA[1]},
  { id: 13, name: 'Crowd Management', issueDate: '2020-01-01', expireDate: '', tId:4 , type: this.certificateTypeService.CERTIFICATE_DATA[3] } // Permanent
];

}
