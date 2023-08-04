import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user = new User();

  public isLoggedIn = false;

  constructor(private readonly keycloak: KeycloakService,
    private readonly dashboardService: DashboardService) { }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.user = await <any> this.dashboardService.loadUserProfile();
      this.user.authStatus = 'AUTH';
      window.sessionStorage.setItem("userdetails",JSON.stringify(this.user));
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    let redirectURI: string = "https://bank.greeta.net/home";
    this.keycloak.logout(redirectURI);
  }

}
