import { ViewChild, AfterViewInit, Component, OnInit,  inject, Input } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,Router, NavigationEnd  } from '@angular/router';


import { Member } from '../../models/lists.model';
import { TranslateModule } from '@ngx-translate/core';
import { NewCrewComponent } from "../new-crew/new-crew.component";
import { ListsService } from '../../services/lists.service';
import { CertificateTypeService } from '../../services/certificate-type.service';
import { Certificate } from '../../models/certificate.model';
import { CertificateType } from '../../models/certificate-type.model';
import { NewCertificateTypeComponent } from "../new-certificate-type/new-certificate-type.component";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CertificateListComponent } from '../certificate-list/certificate-list.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatInput } from '@angular/material/input';

import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-lists',
  standalone: true,
  templateUrl: './crew-lists.component.html',
  styleUrl: './crew-lists.component.css',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatSortModule,
    NewCrewComponent,
    CommonModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    
    MatInput
]
})
export class ListsComponent implements AfterViewInit, OnInit {
    private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  memberBeingEdited: Member | null = null;
  
  selectedMember: Member | null = null;
  newCertificateType: CertificateType|null=null;
  isAddingCrew = false;

  certificateTypeBeingEdited: CertificateType | null = null;
  originalCertName: string | null = null;



  dataSource = new MatTableDataSource<Member>();
  certificateDataSource = new MatTableDataSource<CertificateType>();
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private CertificateTypeService:CertificateTypeService,
    public listsService: ListsService) {}
  //
  //these remains from old codes
  //
  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {//this tied the lifetime of crew list
        this.reloadCrewList();//It reloads the crew list any time the route navigation finishes (even if it's the same /crew route).
      });

    // Initial load
    this.reloadCrewList();
  }
  reloadCrewList() {
    this.dataSource.data = this.listsService.getLoadedMembers();
  }

  loadCertificates() {
    const certificates = this.CertificateTypeService.getCertificateTypes(); // mock or actual
    this.certificateDataSource.data = certificates;
  }
  pageType: 'crew' | 'certificateTypes' = 'crew';
  

   ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  isAddingCertificate = false;

  onStartAddCertificate() {
    this.isAddingCertificate = true;
    this.certificateTypeBeingEdited = null;
  }
  onAddCertificate(newCert: CertificateType) {
  console.log('Edited cert:', newCert);
  console.log('Original name:', this.originalCertName);    
  const index = this.CertificateTypeService.CERTIFICATE_DATA.findIndex(
    c => c.name === this.originalCertName
  );

  if (index !== -1) {
    // Edit existing certificate
    this.CertificateTypeService.CERTIFICATE_DATA[index] = newCert;
  } else {
    // Add new certificate
    this.CertificateTypeService.CERTIFICATE_DATA.push(newCert);
  }


}










  onEditMember(member: Member) {
    this.memberBeingEdited = member;
    this.isAddingCrew = true;

  }
  

   onCancelAddCrew() {
    this.isAddingCrew = false;
  }
  onStartAddCrew(){
    
    this.isAddingCrew = true;
  }
  onAddCrew(crewData: Member) {

    this.listsService.addOrUpdateMember(crewData);

    crewData.totalIncome = this.listsService.calculateTotalIncome(crewData);
    this.dataSource.data = this.listsService.getLoadedMembers()
    this.isAddingCrew = false;
    this.memberBeingEdited = null;
  }

  onDeleteMember(member: Member) {
    const confirmed = confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`);
    if (confirmed) {
      this.listsService.deleteMember(member.id);
      this.dataSource.data = this.listsService.getLoadedMembers()
    }
  }

  editMember(member: Member | null) {
    if (!member) return;
      console.log('Editing:', member);
  }

    openDialog(member: Member) {
      this.dialog.open(CertificateListComponent, {
        data: {
          member: member
        },
        width: '800px',
        height: '800px',
        autoFocus: true
      });
    }



getTotalIncomeForMember(member: Member): number {
  const dailyRate = member.dailyRate ?? 0;
  const days = parseInt(member.daysOnBoard || '0', 10);
  return dailyRate * days;
}
getTotalIncomeByCurrency(currency: string): number {
  
  return this.dataSource.filteredData
    .filter(member => member.currency === currency)
    .reduce((sum, member) => {
      const days = Number(member.daysOnBoard) || 0;
      const baseIncome = days * (member.dailyRate || 0);
      const discount = member.discount || 0;
      const netIncome = baseIncome - discount;
      return sum + netIncome;
    }, 0);
}
getDiscountedIncome(member: Member): number {
  const days = Number(member.daysOnBoard) || 0;
  const base = days * member.dailyRate;
  const discount = member.discount || 0;

  return Math.max(0,base - discount) ;
}

updateTotalIncome(member: Member) {
  if((member.discount??0) < 0){
    member.discount= 0;
  }
  member.totalIncome = this.getDiscountedIncome(member);
  const income = this.getDiscountedIncome(member);
  member.totalIncome = Math.max(0, income);
  console.log(member.totalIncome);
  //to make this persistent overwriting new total income
  const i = this.listsService.CREW_DATA.findIndex(m=>m.id === member.id);
  this.listsService.CREW_DATA[i] = {...member};
  
}

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}


