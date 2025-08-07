import { Component, Output, EventEmitter, Input, SimpleChanges,OnChanges, ViewChild } from '@angular/core';

import { Member } from '../../models/lists.model';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';

import { Certificate } from '../../models/certificate.model';
import { CertificateTypeService } from '../../services/certificate-type.service';
import { CertificateType } from '../../models/certificate-type.model';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { NewCertificateModalComponent } from '../new-certificate-modal/new-certificate-modal.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatDialog } from '@angular/material/dialog';
import { CertificateService } from '../../services/certificate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-new-crew',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDividerModule,
    TranslateModule,
    
],
  templateUrl: './new-crew.component.html',
  styleUrl: './new-crew.component.css'
})
export class NewCrewComponent implements OnChanges {
  constructor(private certificateTypeService: CertificateTypeService,
    private certificateService: CertificateService,
    private dialog: MatDialog
  ) {
    this.certificateTypeOptions = this.certificateTypeService.getCertificateTypes();
  }
  certificateTypeOptions: CertificateType[] = [];
  selectedCertificates: Certificate[] = [];
  oldId = '';
  enteredfirstName= '';
  enteredlastName= '';
  enterednationality= '';
  enteredtitle= '';
  entereddaysOnBoard= '';
  entereddailyRate= 0;
  enteredcurrency='';
  enteredtotalIncome=0;
  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  @Input() memberToEdit: Member | null = null;
  @Output() Add= new EventEmitter<Member>();
  @Output() Cancel = new EventEmitter<void>();
  

  openCertificateModal(): void {
    const dialogRef = this.dialog.open(NewCertificateModalComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: {
        selectedCertificates: this.selectedCertificates
      },
    });

    dialogRef.afterClosed().subscribe((result: Certificate[] | undefined) => {
      if (result) {
        this.selectedCertificates = result;
      }
    });
  }
  onCancel(){
    this.memberToEdit =null;

    
    this.Cancel.emit();
  }
   ngOnChanges(changes: SimpleChanges) {
    if (changes['memberToEdit'] && this.memberToEdit) {
      
      const m = this.memberToEdit;
      this.oldId=m.id;
      this.enteredfirstName = m.firstName;
      this.enteredlastName = m.lastName;
      this.enterednationality = m.nationality;
      this.enteredtitle = m.title;
      this.entereddaysOnBoard = m.daysOnBoard;
      this.entereddailyRate = m.dailyRate;
      this.enteredcurrency = m.currency;
      this.enteredtotalIncome = m.totalIncome;
    }
  }
  onSubmit() {
  this.Add.emit({
    id: this.oldId || Date.now().toString(),
    firstName: this.enteredfirstName,
    lastName: this.enteredlastName,
    nationality: this.enterednationality,
    title: this.enteredtitle,
    daysOnBoard: this.entereddaysOnBoard,
    dailyRate: this.entereddailyRate,
    currency: this.enteredcurrency,
    totalIncome: this.enteredtotalIncome,
    certificates: this.selectedCertificates,

  });
}







}
