import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-certificate-modal',
  standalone: true,
  templateUrl: './new-certificate-modal.component.html',
  styleUrl: './new-certificate-modal.component.css',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class NewCertificateModalComponent {
  name = '';
  issueDate = '';
  expireDate = '';

  constructor(
    private dialogRef: MatDialogRef<NewCertificateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public parentTypeName: string
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({
      id: new Date().getTime().toString(),
      name: this.name,
      issueDate: this.issueDate,
      expireDate: this.expireDate
    });
  }
}
