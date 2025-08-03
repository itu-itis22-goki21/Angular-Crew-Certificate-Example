import { CertificateService } from "./certificate.service";
import { CertificateType } from "./models/certificate-type.model";
import { Certificate } from "./models/certificate.model";
import { Injectable } from "@angular/core";

@Injectable ({providedIn:'root'})
export class CertificateTypeService{
    constructor(private certificateService:CertificateService){}
    getCertificates(): CertificateType[] {
    return [...this.CERTIFICATE_DATA]; // return a copy
    }

    
public CERTIFICATE_DATA: CertificateType[] = [

    {name: 'Captain', description:'ksdfn', certificates:[this.certificateService.CERTIFICATE_DATA[0],
                                                        this.certificateService.CERTIFICATE_DATA[2],
                                                        this.certificateService.CERTIFICATE_DATA[3]],
        
    },
    {name: 'Board', description:'dsjkh',
        certificates: 
            [this.certificateService.CERTIFICATE_DATA[0],
            this.certificateService.CERTIFICATE_DATA[5],
            this.certificateService.CERTIFICATE_DATA[6]
        ],
    },
    {name: 'Sailor', description:'jsdfhlk',
        certificates: 
            [this.certificateService.CERTIFICATE_DATA[7],
            this.certificateService.CERTIFICATE_DATA[8],
            this.certificateService.CERTIFICATE_DATA[9]
        ],
    },
    { name: 'Compass', description:'sjdfkha',
        certificates: 
            [this.certificateService.CERTIFICATE_DATA[10],
            this.certificateService.CERTIFICATE_DATA[11],
            this.certificateService.CERTIFICATE_DATA[12]
        ],
    },
]}
