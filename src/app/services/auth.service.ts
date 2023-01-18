import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiUrl}/login` , { email, password})
      .pipe(
        tap((token) => this.tokenService.saveToken(token.access_token))
      )
  }
  profile(token?: string) {
    let headers = new HttpHeaders();
    // headers = headers.set('Authorization', `Bearer ${token}`);
    // headers = headers.set('Content-Type', 'application/json');
    // return this.http.get<User>(`${this.apiUrl}/profile`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers });
  }
}
