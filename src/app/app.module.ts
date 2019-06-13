import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
// Routing
import { AppRoutingModule } from './app.routing.module';
import { HttpModule } from '@angular/http';
// Angular Material nope
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginComponent } from './views/login/login.component';
import { AuthService } from './auth.service';
import { SurveyComponent } from './views/survey/survey.component';
import { SurveyService } from './survey.service';
import { HomeComponent } from './views/home/home.component';
import { SurveyCompleteComponent } from './views/surveycomplete/surveycomplete.component';
import { AnswerComponent } from './views/answer/answer.component';
// JSON Web Tokens
//import { JwtHelperService } from '@auth0/angular-jwt';

const firebaseConfig = {
  apiKey: "API-KEY",
  authDomain: "AUTH-DOMAIN",
  databaseURL: "DB-URL",
  projectId: "PROJECT-ID",
  storageBucket: "STORAGE-BUCKET",
  messagingSenderId: "MSG-SENDER-ID",
  appId: "APP-ID"
};

@NgModule({
  imports:      [ 
    AppRoutingModule,
    BrowserModule, FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule, AngularFireDatabaseModule,
    HttpModule
  ],
  declarations: [ AppComponent, LoginComponent, SurveyComponent, HomeComponent, SurveyCompleteComponent, AnswerComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ AuthService, SurveyService ]
})
export class AppModule { }
