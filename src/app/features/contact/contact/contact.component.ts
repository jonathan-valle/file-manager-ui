import { Component, OnInit } from "@angular/core";
import { VersionRestService } from "../../../core/service/rest/version-rest.service";
import packageJson from "../../../../../package.json";

@Component({
  selector: "app-home",
  templateUrl: "./contact.component.html"
})
export class ContactComponent implements OnInit {
  version: string = packageJson.version;
  backendVersion?: string;

  constructor(private versionService: VersionRestService) {

  }

  ngOnInit() {
    this.versionService.version().subscribe((version) => {
      this.backendVersion = version;
    });
  }
}
