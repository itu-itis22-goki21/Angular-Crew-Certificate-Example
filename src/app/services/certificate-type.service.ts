import { CertificateService } from "./certificate.service";
import { CertificateType } from "../models/certificate-type.model";
import { Certificate } from "../models/certificate.model";
import { Injectable } from "@angular/core";

@Injectable ({providedIn:'root'})
export class CertificateTypeService{
    constructor(){}
    getCertificateTypes(): CertificateType[] {
    return [...this.CERTIFICATE_DATA]; // return a copy
    }
    getLastId():number{
        return this.CERTIFICATE_DATA.length > 0 ? Math.max(...this.CERTIFICATE_DATA.map(t => t.tId)) : 0;
    }
    
 


    public CERTIFICATE_DATA: CertificateType[] = [

        {tId: 1, name: 'Captain', description:'ksdfn',
            
        },
        {tId: 2, name: 'Board', description:'dsjkh',
            
        },
        {tId: 3, name: 'Sailor', description:'jsdfhlk',
            
        },
        {tId: 4, name: 'Compass', description:'sjdfkha',
            
        },
    ]
}
