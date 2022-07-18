import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ClientAuth } from '../models/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _clientAuth$ = new BehaviorSubject<ClientAuth | undefined>(
    JSON.parse(localStorage.getItem('clientAuth'))
  );

  constructor(private router: Router, private http: HttpClient) {
    this._clientAuth$.subscribe((ca) => console.debug('_clientAuth', ca));
  }

  public get clientAuth(): ClientAuth {
    return this._clientAuth$.value;
  }
  public get clientAuth$(): Observable<ClientAuth> {
    return this._clientAuth$.asObservable();
  }

  login(omsId, token) {
    return this.http
      .post<ClientAuth>(`${environment.apiUrl}/users/authenticate`, {
        omsId,
        token,
      })
      .pipe(
        map((clientAuth) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          console.debug('clientAuth', clientAuth);
          localStorage.setItem('clientAuth', JSON.stringify(clientAuth));
          this._clientAuth$.next(clientAuth);
          return clientAuth;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('clientAuth');
    this._clientAuth$.next(undefined);
    this.router.navigate(['/account/login']);
  }
}
