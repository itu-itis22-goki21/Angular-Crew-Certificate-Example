import { Injectable } from "@angular/core";
import { Certificate } from "./models/certificate.model";


@Injectable({providedIn:'root'})
export class CertificateService{

    public CERTIFICATE_DATA: Certificate[]=[
        {id:2, name: 'STW', expireDate: 'sduflagdk' },
            { id:3,name: 'GO', expireDate: '' },
            { id:4,name: 'Medial', expireDate: '' },
        { id:6,name: 'Security Awareness', expireDate: '' },
        { id:7,name: 'SGK', issueDate: 'sonsuz' },
            {id:8, name: 'BTK', issueDate: 'sonsuz' },
            {id:21, name: 'Security Awareness', expireDate: '' },
            {id:22, name: 'SGK', issueDate: 'sonsuz' },
            {id:23, name: 'BTK', issueDate: 'sonsuz' },
            {id:31, name: 'Security Awareness', expireDate: '' },
            {id:32, name: 'SGK', issueDate: 'sonsuz' },
            {id:33, name: 'BTK', issueDate: 'sonsuz' },
    ]
}
