import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from '../models/UserDto';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private router: Router) {}

  login(username: string, password: string) {
    // Fake
    if (username === 'test' && password === 'test') {
      let userLoggedin: UserDto = {
        name: 'test',
        username: username,
        id: 1,
        password: '',
      };
      localStorage.setItem('user', JSON.stringify(userLoggedin));
      return userLoggedin;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return localStorage.getItem('user') != null;
  }
}
