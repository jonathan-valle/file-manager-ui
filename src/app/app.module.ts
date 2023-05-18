import { APP_INITIALIZER, NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { HttpClient, HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "/api/translations/", "");
}

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        "realm": "master",
        "url": "http://localhost:8083/auth",
        "clientId": "file-manager-ui"
      },
      initOptions: {
        pkceMethod: 'S256',
        onLoad: 'check-sso',
      }
    });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: "en"
    }),
    TranslateModule,
    KeycloakAngularModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    AppRoutingModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService],
  }],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private translateService: TranslateService) {
    // Définit la langue par défaut en anglais
    translateService.setDefaultLang("en");
  }
}
