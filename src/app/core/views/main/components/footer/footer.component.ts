import { Component, OnInit } from "@angular/core";
import packageJson from "../../../../../../../package.json";
import { VersionRestService } from "../../../../service/rest/version-rest.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit{

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
