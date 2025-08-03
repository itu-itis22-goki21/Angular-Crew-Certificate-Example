import { Component, Output, EventEmitter, Input, SimpleChanges,OnChanges } from '@angular/core';

import { Member } from '../models/lists.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';

import { Certificate } from '../models/certificate.model';
import { CertificateTypeService } from '../certificate-type.service';

@Component({
  selector: 'app-new-crew',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
    MatButtonModule
],
  templateUrl: './new-crew.component.html',
  styleUrl: './new-crew.component.css'
})
export class NewCrewComponent implements OnChanges {
  certificateOptions: Certificate[] = [];
  constructor(private certificateTypeService: CertificateTypeService) {
    console.log('NewCrewComponent loaded');
    console.log(this.certificateOptions)
  }

  @Input() memberToEdit: Member | null = null;
  @Output() Add= new EventEmitter<Member>();
  @Output() Cancel = new EventEmitter<void>();
  enteredfirstName= '';
  enteredlastName= '';
  enterednationality= '';
  enteredtitle= '';
  entereddaysOnBoard= '';
  entereddailyRate= 0;
  enteredcurrency='';
  enteredtotalIncome=0;
  
  onCancel(){
    this.Cancel.emit();
  }
   ngOnChanges(changes: SimpleChanges) {
    if (changes['memberToEdit'] && this.memberToEdit) {
      const m = this.memberToEdit;
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
  onSubmit(){
    const id = this.memberToEdit?.id ?? crypto.randomUUID();
    console.log(id);
    this.Add.emit({
      id,
      firstName:this.enteredfirstName,
      lastName:this.enteredlastName,
      nationality:this.enterednationality,
      title:this.enteredtitle,
      daysOnBoard:this.entereddaysOnBoard,
      dailyRate:this.entereddailyRate,
      currency:this.enteredcurrency,
      totalIncome:this.enteredtotalIncome,
      certificateTypes:null,
      
    }); 
  }
}
