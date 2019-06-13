import { Component, OnInit } from '@angular/core';
// FormControl
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
// 
import { AuthService } from '../../auth.service';
import { SurveyService } from '../../survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Alternative, Question, QuestionOpen, Group, Survey, User } from '../../classes';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  private control : FormGroup;
  
  private survey : Survey;
  private questions : Array<any>;

  private form_status : boolean = false;
  private is_param_new : boolean = false;

  constructor(
    private auth: AuthService,
    private surveys : SurveyService,
    private route : ActivatedRoute,
    private router : Router
    ) { }

  ngOnInit() {
    console.log('init');
    this.auth.checkLogin();

    // authservice.checkLogin()
    this.control = new FormGroup({
      /*
      nome: new FormControl('', [Validators.pattern("^[a-zA-Z ]*$")]),
      mail: new FormControl('', [Validators.email]),
      nascimento: new FormControl('', []),
      curso: new FormControl('', [])
      */
      title   : new FormControl('', []),
      start   : new FormControl('', []),
      end     : new FormControl('', []),
      groups  : new FormControl('', [])
    });

    this.route.params.subscribe( (param) => {
      console.log(param);
      this.survey = new Survey();
      this.survey.groups = new Array<Group>();
      if (param.command === "new")
      {
        this.is_param_new = true;
        this.survey.groups.push(new Group()); // Grupo default
        this.survey.groups[0].closed_questions = new Array<Question>();
        this.survey.groups[0].open_questions = new Array<QuestionOpen>();
        this.questions = new Array<any>();
        // Adicionar por padrão uma questão (mínimo)
        console.log(this.survey);
      }
      else
      {
        // EDIT
        this.is_param_new = false;
        let sur = this.surveys.getAllSurveys(this.auth.getInfoCurrentUser().uid);
        sur.forEach( a => {
          a.forEach( b => {
            this.survey = this.surveys.convertToSurvey(b, param.id)[0];
          })
        })
        
        // console.log(param.id, this.survey)
        // console.log(this.surveys.convertToSurvey(sur, param.id))
      }

    });

  }

  loggs() {
    console.log(this.survey);
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  clearSurvey() {
    this.control.reset();
  }

  getUnifiedQuestionArray(group : Group)
  {
    this.questions = new Array<any>();
    if( group.closed_questions )
      group.closed_questions.forEach( el => {
        this.questions.push(el);
      })
    if( group.open_questions )
      group.open_questions.forEach( el => {
        this.questions.push(el);
      })
    return this.questions;
  }

  saveSurvey() {
    this.form_status = !this.form_status;
    if (!this.control.invalid)
    {
      // console.log(this.survey);
      if (
        this.survey.groups[0].closed_questions.length === 0 ||
        this.survey.groups[0].open_questions.length === 0)
        {
          console.log('erro de save')
          ; // show error via modal?
        }
        else
        {
          if (this.is_param_new) 
          {
            this.survey.title = this.control.value.title;
            this.survey.end = this.control.value.end;
            this.survey.start = this.control.value.start;
            this.surveys.insertSurvey(this.auth.getInfoCurrentUser().uid, this.survey)
            .then(
              (s) => {
                console.log(s);
                this.router.navigate(['surveycomplete', s.key]);
              }
            )
            .catch(
              (e) => {
                console.log(e);
              }
            )
          }
          else
          {
            ; // send update request
            this.survey.title = this.control.value.title;
            this.survey.end = this.control.value.end;
            this.survey.start = this.control.value.start;
            this.surveys.updateSurvey(this.auth.getInfoCurrentUser().uid, this.survey.key, this.survey)
            .then(
              (s) => {
                // console.log(s);
                this.router.navigate(['surveycomplete', s.key]);
              }
            )
            .catch(
              (e) => {
                console.log(e);
              }
            )
          }
        }
    }
    this.form_status = !this.form_status;
  }

  addGroup()
  {
    let ng = new Group();
    ng.closed_questions = new Array<Question>();
    ng.open_questions = new Array<QuestionOpen>();
    this.survey.groups.push(ng);
  }

  // no remove group

  addQuestion(group : Group, type : string) {
    console.log(group, type)
    if (type === 'alternative')
    {
      let question : Question = new Question();
      question.alternatives = new Array<Alternative>();
      question.alternatives.push(new Alternative());
      group.closed_questions.push(question);
    }
    else // OPEN
    {
      let question : QuestionOpen = new QuestionOpen();
      group.open_questions.push(question)
    }
  }

  addAlternative(group : Group, question : Question) {
    let result = group.closed_questions.filter(
      q => q.title === question.title
    )
    let rre = result[0];
    if (rre.alternatives === null || rre.alternatives === undefined)
    {
      rre.alternatives = new Array<Alternative>();  
    }
    rre.alternatives.push(new Alternative());
  }

  removeAlternative(question : Question, alt : Alternative)
  {
    question.alternatives.splice(question.alternatives.indexOf(alt), 1);
  }

  removeQuestion(group : Group, question : any) {
    // 
    if (group.open_questions.indexOf(question) !== -1)
    {
      group.open_questions.splice(group.open_questions.indexOf(question), 1);
    }
    else
    {
      group.closed_questions.splice(group.closed_questions.indexOf(question), 1);
    }
    
  }

}