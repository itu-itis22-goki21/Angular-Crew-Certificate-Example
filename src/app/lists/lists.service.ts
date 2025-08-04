import { Member } from "./models/lists.model";
import { CertificateType } from "./models/certificate-type.model";
import { Injectable } from "@angular/core";
import { CertificateTypeService } from "./certificate-type.service";
@Injectable({providedIn:'root'})

export class ListsService{
  constructor(public certificateService: CertificateTypeService){};
  getMembers(): Member[] {
    return [...this.CREW_DATA]; // return a copy
  }
    calculateTotalIncome(member: Member): number {
    const days = Number(member.daysOnBoard) || 0;
    const rate = member.dailyRate || 0;
    const discount = member.discount || 0;
    return days * rate - discount;
  }

  addOrUpdateMember(member: Member) {
    const index = this.CREW_DATA.findIndex(m => m.id === member.id);
    if (index !== -1) {
      this.CREW_DATA[index] = member;
    } else {
      this.CREW_DATA.push(member);
    }
  }

  deleteMember(id: string) {
    this.CREW_DATA = this.CREW_DATA.filter(m => m.id !== id);
  }
    public CREW_DATA: Member[] = [
  {
    id:'1',
    firstName: 'Burak',
    lastName: 'İnce',
    nationality: 'Turkish',
    title: 'Traveller',
    daysOnBoard: '20',
    dailyRate: 1,
    currency: 'USD',
    discount: 0,
    totalIncome: 1,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[1], 
                  this.certificateService.CERTIFICATE_DATA[2]],
      
  },
  {
    id:'2',
    firstName: '2nd member',
    lastName: '2nd member',
    nationality: 'Turkish',
    title: 'Captain',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'EUR',
    discount: 0,
    totalIncome: 2,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[0]]
  },
  {
    id:'3',
    firstName: '3rd member',
    lastName: '3rd member',
    nationality: 'British',
    title: 'Traveller',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'EUR',
    discount: 0,
    totalIncome: 2,
    certificateTypes: [
      
    ]
  },
  {
    id:'4',
    firstName: '4th member',
    lastName: '4th member',
    nationality: 'British',
    title: 'Machinist',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'USD',
    discount: 0,
    totalIncome: 2,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[3]]
  },
  {
    id:'5',
    firstName: '5th member',
    lastName: '5th member',
    nationality: 'Portuguese',
    title: 'Machinist',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'USD',
    discount: 0,
    totalIncome: 2,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[2]]
  },
  {
    id:'6',
    firstName: '6th member',
    lastName: '6th member',
    nationality: 'British',
    title: 'Machinist',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'USD',
    discount: 0,
    totalIncome: 0,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[1]]
  }
];
}