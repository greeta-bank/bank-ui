import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { User } from '../model/user.model';
import { KeycloakProfile } from 'keycloak-js';
import { DashboardService } from '../services/dashboard/dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class AuthKeyClockGuard extends KeycloakAuthGuard {
  user = new User();
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private dashboardService: DashboardService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }else{
      this.user =  await <any> this.dashboardService.loadUserProfile();
      this.user.authStatus = 'AUTH';
      window.sessionStorage.setItem("userdetails",JSON.stringify(this.user));
    }

    // Get the roles required from the route.
    const requiredRoles = route.data["roles"];

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.some((role) => this.roles.includes(role));
  }
}
