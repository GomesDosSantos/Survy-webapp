import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { SurveyService } from '../../survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Alternative, Question, QuestionOpen, Group, Survey, User } from '../../classes';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user_surveys : Observable<any>;
  p_surveys : Survey[];

  constructor(private auth: AuthService, private surveys : SurveyService, private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {
    // this.auth.checkLogin();

    // let u = new User();
    // u.usuario = this.auth.getInfoCurrentUser().displayName;
    // this.surveys.getUser( this.auth.getInfoCurrentUser().uid, u);

    //this.surveys.insertUser( <User>({user: '', surveys: null}) ); // TypeAssertion
    // let user : Usuario = new User(); user.user = 'asadsa';
    this.user_surveys = this.surveys.getAllSurveys(this.auth.getInfoCurrentUser().uid);
    
    this.user_surveys.subscribe(
      (s) => {
        this.p_surveys = new Array<Survey>();
        s.forEach( a => {
          this.surveys.convertToSurvey(a).forEach( su => {
            this.p_surveys.push(su);
            console.log(su)
          })
        });
      }
    )
  }

  adicionarQuestionario() {
    this.router.navigate(['survey', 'new']);
  }

  deletarQuestionario(qkey : string)
  {
    this.surveys.deleteSurvey(this.auth.getInfoCurrentUser().uid, qkey);
  }

  editarQuestionario(qkey : string)
  {
    this.router.navigate(['survey', 'edit', qkey])
  }

}