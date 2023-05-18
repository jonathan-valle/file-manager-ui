import { Component } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { from } from "rxjs";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html"
})
export class ToolbarComponent {

  isLoggedIn = false;

  constructor(private keycloakService: KeycloakService) {
    from(this.keycloakService.isLoggedIn()).subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  login() {
    from(this.keycloakService.login()).subscribe(() => {
      // nothing to do
    })

  }

  logout() {
    from(this.keycloakService.logout()).subscribe(() => {
      // nothing to do
    })
  }
}
