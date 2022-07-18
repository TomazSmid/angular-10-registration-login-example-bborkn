import { Component } from '@angular/core';

import { ClientAuth } from '../../models';
import { AuthService } from '../../services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  clientAuth: ClientAuth;

  constructor(private accountService: AuthService) {
    this.clientAuth = this.accountService.clientAuth;
  }
}
