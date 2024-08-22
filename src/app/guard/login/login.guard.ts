import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router,
    private storage: Storage) {

  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.checkLoggedIn();
  }

  async checkLoggedIn() {
    return await this.storage.get('logged_in').then(data => {
      if (data) {
        this.router.navigateByUrl('/tabs/attendance');
        return false;
      } else {
        return true;
      }
    });
  }
}
