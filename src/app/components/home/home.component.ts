import { Component } from '@angular/core';

import { ClientAuth } from '../../models';
import { AuthService } from '../../services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  clientAuth$ = this.accountService.clientAuth$;

  constructor(private accountService: AuthService) {}
}
