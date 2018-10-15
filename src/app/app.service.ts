import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AppService {

  constructor(private http: HttpClient) {
  }

  private apiBase = `${document.location.protocol}//${window.location.hostname}:3000`;

  submitForm(form, songId) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    delete user.songs;
    return this.http.post<any>(`${this.apiBase}/submit/${user.id}/${songId}`, Object.assign({}, {first_name: user.first_name}, {last_name: user.last_name}, form));
  }

  authorizeJWT(token) {
    return this.http.post<any>(`${this.apiBase}/jwt`, { token: token });
  }

}
