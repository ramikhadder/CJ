import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {Observable} from 'rxjs';
import {AppService} from './app.service';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AppAuthGuard implements CanActivate {

  constructor(
    private activatedRoute: ActivatedRoute,
    private appService: AppService) {}


  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log(route.queryParams);
    return this.appService.authorizeJWT(route.queryParams.token).pipe(
      map((data) => {
        sessionStorage.setItem('user', JSON.stringify(data));
        return true;
      })
    );
  }
}
