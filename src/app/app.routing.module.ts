import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { SurveyComponent } from './views/survey/survey.component';
import { SurveyCompleteComponent } from './views/surveycomplete/surveycomplete.component';
import { AnswerComponent } from './views/answer/answer.component';

@NgModule({
  declarations: [ 
    // LoginComponent, SurveyComponent
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      // { path: '**', redirectTo: 'surveycomplete/-Lfyd9uY3fmUbVUSBgPG' },
      // { path: '**', redirectTo: 'answer/32J30OPgWFY7yX1mojuRqlZeiE32/-Lfyd9uY3fmUbVUSBgPG/guilhermegomes@tecsus.com.br/364' },
      { path: 'answer/:user/:survey/:email/:token', component: AnswerComponent },
      { path: 'login',                        component: LoginComponent },
      { path: 'home',                         component: HomeComponent },
      { path: 'survey/:command',              component: SurveyComponent },
      { path: 'survey/:command/:id',          component: SurveyComponent },
      { path: 'surveycomplete/:id',           component: SurveyCompleteComponent },
      { path: '**',                           redirectTo: 'login' }
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule {}


