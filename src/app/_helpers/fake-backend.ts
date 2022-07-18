import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { EmissionCmResponse } from '../models/request/EmissionCmResponse';

// array in local storage for registered users
const usersKey = 'angular-10-registration-login-example-users';
let users = JSON.parse(localStorage.getItem(usersKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/api/v2/orders') && method === 'POST':
        case url.endsWith('/api/v2/orders/') && method === 'POST':
          return cmResponse();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        default:
          console.warn('handleRoute default', request);
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      console.debug('authenticate', body);
      return ok(body);
    }

    function cmResponse(): Observable<HttpResponse<EmissionCmResponse>> {
      if (!isLoggedIn()) return unauthorized();
      return ok({
        omsId: body.omsId,
        orderId: 'b55aa676-0683-11ed-b939-0242ac120002',
        expectedCompletionTime: 50,
      });
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      const user = users.find((x) => x.id === idFromUrl());
      return ok(basicDetails(user));
    }

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message) {
      return throwError({ error: { message } }).pipe(
        materialize(),
        delay(500),
        dematerialize()
      ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function unauthorized() {
      return throwError({
        status: 401,
        error: { message: 'Unauthorized' },
      }).pipe(materialize(), delay(500), dematerialize());
    }

    function basicDetails(user) {
      const { id, username, firstName, lastName } = user;
      return { id, username, firstName, lastName };
    }

    function isLoggedIn() {
      return !!headers.get('clientToken');
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
