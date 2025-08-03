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
    firstName: 'dummy data',
    lastName: 'dummy data',
    nationality: 'dummy data',
    title: 'dummy data',
    daysOnBoard: 'dummy data',
    dailyRate: 1,
    currency: 'dummy data',
    totalIncome: 1,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[1], 
                  this.certificateService.CERTIFICATE_DATA[2]],
      
  },
  {
    id:'2',
    firstName: '2nd member',
    lastName: '2nd member',
    nationality: '2nd member',
    title: 'Captain',
    daysOnBoard: '2nd member',
    dailyRate: 2,
    currency: '2nd member',
    totalIncome: 2,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[0]]
  },
  {
    id:'3',
    firstName: '3rd member',
    lastName: '3rd member',
    nationality: '3rd member',
    title: '3rd member',
    daysOnBoard: '3rd member',
    dailyRate: 2,
    currency: '3rd member',
    totalIncome: 2,
    certificateTypes: [
      this.certificateService.CERTIFICATE_DATA[4],
    ]
  },
  {
    id:'4',
    firstName: '4th member',
    lastName: '4th member',
    nationality: '4th member',
    title: '4th member',
    daysOnBoard: '4th member',
    dailyRate: 2,
    currency: '4th member',
    totalIncome: 2,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[3]]
  },
  {
    id:'5',
    firstName: '5th member',
    lastName: '5th member',
    nationality: '5th member',
    title: '5th member',
    daysOnBoard: '5th member',
    dailyRate: 2,
    currency: '5th member',
    totalIncome: 2,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[2]]
  },
  {
    id:'6',
    firstName: '6th member',
    lastName: '6th member',
    nationality: '6th member',
    title: '6th member',
    daysOnBoard: '6th member',
    dailyRate: 2,
    currency: '6th member',
    totalIncome: 2,
    certificateTypes: [this.certificateService.CERTIFICATE_DATA[1]]
  }
];
}