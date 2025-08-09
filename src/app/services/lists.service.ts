import { Member } from "../models/lists.model";
import { CertificateType } from "../models/certificate-type.model";
import { Injectable } from "@angular/core";
import { CertificateTypeService } from "./certificate-type.service";
import { CertificateService } from "./certificate.service";
import { ActivatedRoute,Router } from '@angular/router';
@Injectable({providedIn:'root'})

export class ListsService{
  constructor(public certificateType: CertificateTypeService, private router: Router, public certificateService: CertificateService){};
  public filteredCrew: Member[] | null = null;
  getMembers(): Member[] {
    
    return [...this.CREW_DATA]; // return a copy
  }
    calculateTotalIncome(member: Member): number {
    const days = Number(member.daysOnBoard) || 0;
    const rate = member.dailyRate || 0;
    const discount = member.discount || 0;
    return days * rate - discount;
  }
    goCardPage(member: Member) {
    this.router.navigate(['/crew-card', member.id]);
  }
  addOrUpdateMember(member: Member) {
    console.log(member);
    const index = this.CREW_DATA.findIndex(m => m.id === member.id);
    if (index !== -1) {
      this.CREW_DATA[index] = {
        ...member,
        certificates: this.CREW_DATA[index].certificates//bu şaka mı
      };

    } else {
      this.CREW_DATA.push(member);
    }
  }
  

  loadMember(id: string | null) {
    const crewDetails = this.CREW_DATA.find(m => m.id === id) || null;

    if (crewDetails) {
      crewDetails.totalIncome = this.calculateTotalIncome(crewDetails);
    }
    return crewDetails
  }
  //these two written in order to filtering crew while magic search
  

  loadAllMembers(element: Member[]|null) {
    if(element === null){
      
      return this.getMembers().map(member => ({
        ...member,
        totalIncome: this.calculateTotalIncome(member),
      }));
       
    }else{
      this.filteredCrew = element;
      return this.filteredCrew;
    };
  }
    
  getLoadedMembers(): Member[] {
    return this.filteredCrew ?? this.getMembers().map(member => ({
      ...member,
      totalIncome: this.calculateTotalIncome(member),
    }));
  }
  
  deleteMember(id: string) {
    this.CREW_DATA = this.CREW_DATA.filter(m => m.id !== id);
  }

    public CREW_DATA: Member[] = [
  {
    id:'1',
    firstName: 'Burak',
    lastName: 'Yılmaz',
    nationality: 'Turkish',
    title: 'Traveller',
    daysOnBoard: '20',
    dailyRate: 1,
    currency: 'USD',
    discount: 0,
    totalIncome: 1,
    certificates:[this.certificateService.CERTIFICATE_DATA[0],
    this.certificateService.CERTIFICATE_DATA[1],
    this.certificateService.CERTIFICATE_DATA[2],],


      
  },
  {
    id:'2',
    firstName: 'Fatih',
    lastName: 'Terim',
    nationality: 'Turkish',
    title: 'Captain',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'EUR',
    discount: 0,
    totalIncome: 2,
    certificates:[this.certificateService.CERTIFICATE_DATA[4],
    this.certificateService.CERTIFICATE_DATA[5],
    this.certificateService.CERTIFICATE_DATA[6],],
    

  },
  {
    id:'3',
    firstName: 'Gumball',
    lastName: 'Richardson',
    nationality: 'British',
    title: 'Traveller',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'EUR',
    discount: 0,
    totalIncome: 2,
    certificates:[],
    

  },
  {
    id:'4',
    firstName: 'Darwin',
    lastName: 'Richardson',
    nationality: 'British',
    title: 'Machinist',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'USD',
    discount: 0,
    totalIncome: 2,
    certificates:[this.certificateService.CERTIFICATE_DATA[3],
    this.certificateService.CERTIFICATE_DATA[7],
    this.certificateService.CERTIFICATE_DATA[8],],
    

  },
  {
    id:'5',
    firstName: 'Cristiano',
    lastName: 'Ronaldo',
    nationality: 'Portuguese',
    title: 'Machinist',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'USD',
    discount: 0,
    totalIncome: 2,
    certificates: [this.certificateService.CERTIFICATE_DATA[9]],

  },
  {
    id:'6',
    firstName: 'David',
    lastName: 'Beckham',
    nationality: 'British',
    title: 'Machinist',
    daysOnBoard: '20',
    dailyRate: 2,
    currency: 'USD',
    discount: 0,
    totalIncome: 0,
    certificates:[this.certificateService.CERTIFICATE_DATA[9],
    this.certificateService.CERTIFICATE_DATA[10],
    this.certificateService.CERTIFICATE_DATA[11],],
    

  }
];
}