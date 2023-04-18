import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { MessagesModule } from "primeng/messages";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ProgressBarModule } from "primeng/progressbar";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { BlockUIModule } from "primeng/blockui";
import { MessageModule } from "primeng/message";
import { MenuModule } from "primeng/menu";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { MultiSelectModule } from "primeng/multiselect";
import { SplitButtonModule } from "primeng/splitbutton";
import { PanelModule } from "primeng/panel";
import { BadgeModule } from "primeng/badge";
import { AccordionModule } from "primeng/accordion";
import { CardModule } from "primeng/card";
import { InputSwitchModule } from "primeng/inputswitch";

@NgModule({
  declarations: [
    ...PrimeNgModule.DIRECTIVE_LIST,
  ],
  imports: [
    ...PrimeNgModule.MODULES_LIST
  ],
  exports: [
    ...PrimeNgModule.DIRECTIVE_LIST,
    ...PrimeNgModule.MODULES_LIST
  ]
})
export class PrimeNgModule {

  /* List of PrimeNG related directive */
  static DIRECTIVE_LIST = [];

  /* List of used PrimeNG modules */
  static MODULES_LIST = [
    BadgeModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    ProgressSpinnerModule,
    DynamicDialogModule,
    ProgressBarModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    BlockUIModule,
    MessagesModule,
    MessageModule,
    MenuModule,
    TableModule,
    TagModule,
    MultiSelectModule,
    SplitButtonModule,
    PanelModule,
    AccordionModule,
    CardModule,
    InputSwitchModule
  ];

}
