import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from './login.service'; // Assuming LoginService is used to authenticate

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, TranslateModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  @Output() loginStatus = new EventEmitter<boolean>();

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]); // Added password FormControl
  hide = signal(true);
  errorMessage = signal('');

  constructor(private loginService: LoginService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onLogin() {
    if (this.email.invalid || this.password.invalid) {
      console.log('Invalid email or password');
      return; 
    }

    // Now you have the email and password to check
    const email = this.email.value ?? '';
    const password = this.password.value ?? '';

    // Authenticate using the LoginService
    this.loginService.authenticate(email, password).subscribe((authenticated: boolean) => {
      if (authenticated) {
        console.log('User authenticated');
        this.loginStatus.emit(true);
      } else {
        console.log('Invalid credentials');
        this.loginStatus.emit(false);
      }
    });
  }
}
