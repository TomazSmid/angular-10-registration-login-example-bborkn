import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { AuthService } from '.';
import { EmissionCmRequest } from '../models';
import { EmissionCmResponse } from '../models/request/EmissionCmResponse';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private authService: AuthService, private http: HttpClient) {}

  orderRequest(request: EmissionCmRequest) {
    const body = {
      ...request,
      omsId: this.authService.clientAuth.omsId,
    };
    return this.http
      .post<EmissionCmResponse>(`${environment.apiUrl}/api/v2/orders/`, body, {
        headers: { clientToken: this.authService.clientAuth.token },
      })
      .pipe(shareReplay(1));
  }
}
