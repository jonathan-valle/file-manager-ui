import { NgModule } from "@angular/core";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faCheck,
  faClose,
  faCloudArrowUp,
  faLock,
  faLockOpen,
  faQuestion,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

@NgModule({
  imports: [
    FontAwesomeModule
  ],
  exports: [
    FontAwesomeModule
  ]
})
export class FaIconsModule {

  /**
   * List of used FontAwesome icons used throughout the app.
   *
   * for more details, see: https://github.com/FortAwesome/angular-fontawesome/blob/master/docs/usage/icon-library.md
   */
  static ICONS_LIST: IconDefinition[] = [
    faLock,
    faQuestion,
    faClose,
    faLockOpen,
    faTriangleExclamation,
    faCloudArrowUp,
    faCheck
  ];

  constructor(faIconLibrary: FaIconLibrary) {
    faIconLibrary.addIcons(...FaIconsModule.ICONS_LIST);
  }

}
