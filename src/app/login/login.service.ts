
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface login{
    mail: string,
    password: string
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  authenticate(email: string, password: string): Observable<boolean> {
    // Replace with actual authentication logic (e.g., HTTP call)
    console.log('Authenticating with', email, password);
    const user = this.LOGIN_DATA.find(m => m.mail === email && m.password === password);
    // Mock response for demo purposes
    if (user) {
      return of(true); // Successful authentication
    } else {
      return of(false); // Invalid credentials
    }
  }
    private LOGIN_DATA: login[] = [{
        mail:'example@digitall-ocean.com',
        password:'12345'
        },
        {
            mail:'admin@digitall-ocean.com',
            password:'12345'
        },
        {
            mail:'postihsang@gmail.com',
            password:'12345'
        }
    ]
}