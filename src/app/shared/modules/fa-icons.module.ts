import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBan,
  faBars,
  faCartShopping,
  faCertificate,
  faCheck,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleDown,
  faCircleInfo,
  faCirclePlus,
  faCircleXmark, faClose, faCoffee,
  faComments,
  faEllipsisVertical,
  faEnvelope,
  faExclamationTriangle,
  faEye,
  faFileCircleCheck,
  faFileContract,
  faFileInvoice,
  faFileInvoiceDollar,
  faFileLines,
  faFolder,
  faFolderOpen,
  faHouseUser, faLock,
  faMagnifyingGlass,
  faPaperPlane,
  faPencil,
  faPeopleGroup,
  faPlus, faQuestion,
  faRotateLeft,
  faRotateRight,
  faSave,
  faSignOutAlt,
  faSpinner,
  faTimes,
  faUpload,
  faUser,
  faUsers,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleCheck as farCircleCheck,
  faCircleQuestion,
  faCircleXmark as farCircleXmark
} from '@fortawesome/free-regular-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

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
    faClose
  ];

  constructor(faIconLibrary: FaIconLibrary) {
    faIconLibrary.addIcons(...FaIconsModule.ICONS_LIST);
  }

}
