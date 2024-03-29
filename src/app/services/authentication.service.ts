import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';



export interface Credentials {
  userName: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  private static instance: AuthenticationService;
  private static router: Router;
  private static http: HttpClient;

  private BACKEND_API: string =`${ environment.API_BASE_URL}/api/v1`;

  constructor(router: Router, http: HttpClient) {
    AuthenticationService.http = http;
    AuthenticationService.router = router;
  }


  public static getInstance(router: Router, http: HttpClient): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService(router, http);
    }
    return AuthenticationService.instance;
  }

  logIn(userName: string, password: string): boolean {
    const cre: Credentials = {
      userName: userName,
      password: password
    }
    this.authenticate(cre);
    return AuthenticationService.isAuthenticated();
  }



  authenticate(credentials: Credentials): void {
    AuthenticationService.http.post(`${this.BACKEND_API}/register/login`, credentials)
      .subscribe((response: any) => {
        if (response && response.success) {
          alert(1)
          localStorage.setItem('Auth', 'true')
          localStorage.setItem('username', credentials.userName)
          AuthenticationService.router.navigate(['/']);
        } else {
          this.logout()
        }
      });
  }


  logout() {
    localStorage.setItem('Auth', 'false')
    localStorage.setItem('username', '')
  }


  public static isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      return localStorage.getItem('Auth') === 'true';
    }
    return false;
  }


  signUp(userName: string, password: string) {

    const credentials = { userName, password };
    const signUpUrl = `${this.BACKEND_API}/register`;
    AuthenticationService.router.navigate(['/auth/login']).then(r => true);
    return AuthenticationService.http.post(signUpUrl, credentials).subscribe(
      (response) => {
        console.log('Response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  public static canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }

  public static getUser(): string {
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      const storedUsername = localStorage.getItem('username');
      return storedUsername ? String(storedUsername) : '';
    } else {
      return '';
    }
  }


}
