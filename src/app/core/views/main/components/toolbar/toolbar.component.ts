import { Component } from "@angular/core";
import packageJson from "../../../../../../../package.json";
import { VersionRestService } from "../../../../service/rest/version-rest.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent{

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
