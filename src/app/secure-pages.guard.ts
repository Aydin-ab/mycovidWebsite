import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MycovidService } from './mycovid.service';

@Injectable({
  providedIn: 'root'
})
export class SecurePagesGuard implements CanActivate {
  constructor(private mycovidService: MycovidService,
    private router: Router){};
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if(this.mycovidService.userSignedIn()) {

      this.router.navigate(["home"]);

    }
    
      return true;
  }
  
}
