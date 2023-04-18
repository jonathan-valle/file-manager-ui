import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "../shared/shared.module";
import { MainView } from "./views/main/main.view";
import { FeaturesView } from "../features/features.view";
import { QuestionRestService } from "./service/rest/question-rest.service";
import { ToolbarComponent } from "./views/main/components/toolbar/toolbar.component";
import { TopicRestService } from "./service/rest/topic-rest.service";
import { QuestionService } from "./service/question.service";
import { TopicService } from "./service/topic.service";
import { ChatRestService } from "./service/rest/chat.rest.service";
import { FileMergeRestService } from "./service/rest/file-merge.rest.service";
import { VersionRestService } from "./service/rest/version-rest.service";
import { FooterComponent } from "./views/main/components/footer/footer.component";

@NgModule({
  declarations: [
    ...CoreModule.COMPONENTS_LIST
  ],
  imports: [
    SharedModule,
    ...CoreModule.MODULE_LIST
  ],
  exports: [
    SharedModule,
    ...CoreModule.COMPONENTS_LIST
  ],
  providers: [
    ...CoreModule.PROVIDER_LIST
  ]
})
export class CoreModule {

  /**
   * Core components
   */
  static COMPONENTS_LIST = [
    MainView,
    FeaturesView,
    ToolbarComponent,
    FooterComponent
  ];

  /**
   * Core modules
   */
  static MODULE_LIST = [
    /* Angular module */
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ];

  /**
   * Services, pipes, interceptors, guards, etc.
   */
  static PROVIDER_LIST = [

    /* Rest Services */
    QuestionRestService,
    TopicRestService,
    ChatRestService,
    FileMergeRestService,
    VersionRestService,

    /* Business Services */
    QuestionService,
    TopicService
  ];

}
