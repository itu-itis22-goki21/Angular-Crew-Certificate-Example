import { CertificateService } from "./certificate.service";
import { CertificateType } from "./models/certificate-type.model";
import { Certificate } from "./models/certificate.model";
import { Injectable } from "@angular/core";

@Injectable ({providedIn:'root'})
export class CertificateTypeService{
    private certificateTypes: CertificateType[] = [];
    constructor(private certificateService:CertificateService){}
    getCertificates(): CertificateType[] {
    return [...this.CERTIFICATE_DATA]; // return a copy
    }
    getLastId():number{
        return this.CERTIFICATE_DATA.length > 0 ? Math.max(...this.CERTIFICATE_DATA.map(t => t.tId)) : 0;
    }
    
    setCertificates(certs: CertificateType[]) {
        this.certificateTypes = certs;
    }

    addCertificate(cert: Certificate) {
        let type = this.certificateTypes.find(t => t.tId === cert.tId);
        if (!type) {
        type = { tId: cert.tId, name: 'Unknown', description: '', certificates: [] };
        this.certificateTypes.push(type);
        }
        type.certificates?.push(cert);
    }
    public CERTIFICATE_DATA: CertificateType[] = [

        {tId: 1, name: 'Captain', description:'ksdfn', certificates:[this.certificateService.CERTIFICATE_DATA[0],
                                                            this.certificateService.CERTIFICATE_DATA[2],
                                                            this.certificateService.CERTIFICATE_DATA[3]],
            
        },
        {tId: 2, name: 'Board', description:'dsjkh',
            certificates: 
                [this.certificateService.CERTIFICATE_DATA[0],
                this.certificateService.CERTIFICATE_DATA[5],
                this.certificateService.CERTIFICATE_DATA[6]
            ],
        },
        {tId: 3, name: 'Sailor', description:'jsdfhlk',
            certificates: 
                [this.certificateService.CERTIFICATE_DATA[7],
                this.certificateService.CERTIFICATE_DATA[8],
                this.certificateService.CERTIFICATE_DATA[9]
            ],
        },
        {tId: 4, name: 'Compass', description:'sjdfkha',
            certificates: 
                [this.certificateService.CERTIFICATE_DATA[10],
                this.certificateService.CERTIFICATE_DATA[11],
                this.certificateService.CERTIFICATE_DATA[12]
            ],
        },
    ]
}
