import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private userKey = 'loggedInUser';

  login(user: string) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.userKey, user);
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.userKey);
    }
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.userKey) !== null;
    }
    return false; 
  }
}
