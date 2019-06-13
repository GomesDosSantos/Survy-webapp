import { Component, OnInit } from '@angular/core';
//
import { AuthService } from '../../auth.service';
import { SurveyService } from '../../survey.service';
import { Router, ActivatedRoute } from '@angular/router';
//
import { Alternative, Question, QuestionOpen, Group, Survey, User } from '../../classes';
//
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {

  private user_key    : string;
  private survey_key  : string;
  private email       : string;
  private token       : string;
  private has_answered: boolean = false;

  private ori_survey  : Survey[];
  private survey      : Survey[];

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private auth : AuthService,
    private surveys : SurveyService
  ) { }

  ngOnInit() {
    // Route param
    // Route show survey
    this.route.params.subscribe( s => {
      this.user_key = s.user;
      this.survey_key = s.survey;
      this.email = s.email;
      this.token = s.token;
    })

    let user_surveys = this.surveys.getAllSurveys(this.user_key);
    
    user_surveys.subscribe(
      (s) => {
        this.survey = new Array<Survey>();
        this.ori_survey = new Array<Survey>();
        s.forEach( a => {
          if (a[this.survey_key])
          {
            this.surveys.convertToSurvey(a, this.survey_key).forEach( su => {
              this.ori_survey.push(su); // Original object
              this.survey.push(Object.assign({}, su)); // Copy
              this.survey[0].groups.forEach( g => {
                g.open_questions.forEach( o => {
                  o.responses.push('');
                })
              })
              this.survey.splice(1);
            })
          }
        });
      }
    )
  }

  logs()
  {
    console.log(this.survey[0])
  }

  validateSurvey(sur : Survey)
  {
    if (sur.end === undefined || sur.end === null)
      return true;
    // let start_date = formatDate(sur.start, 'yyyy-MM-dd', 'en'); // DATE to STR
    // let end_date = formatDate(sur.end, 'yyyy-MM-dd', 'en');
    let start_date = new Date(sur.start);  // STR to DATE
    let end_date = new Date(sur.end);
    let today = new Date();
    console.log(start_date, end_date, today)
    if (today > end_date || today < start_date)
      return false;
  }

  saveAnswer()
  {
    let original = this.ori_survey[0];
    let atual = this.survey[0];
    original.views += 1;
    atual.groups.forEach(g => {
      let g_index = original.groups.indexOf(g);
      // Questões Abertas
      g.open_questions.forEach( oq => {
        let index_ = original.groups[g_index].open_questions.indexOf(oq);
        // original.groups[g_index].open_questions[index_].responses.concat(oq.responses);
        // if (original.groups[g_index].open_questions[index_].responses instanceof String)
        // {
        //   let d = original.groups[g_index].open_questions[index_].responses;
        //   original.groups[g_index].open_questions[index_].responses = new Array<string>();
        //   original.groups[g_index].open_questions[index_].responses.push(d);
          
        // }
        // else
        // {
        //   original.groups[g_index].open_questions[index_].responses = new Array<string>();
        //   original.groups[g_index].open_questions[index_].responses.push(oq.responses);
        // }
        original.groups[g_index].open_questions[index_].responses.push(oq.responses[oq.responses.length-1]);
      })
      // Questões Fechadas
      g.closed_questions.forEach( cq => {
        let index_ = original.groups[g_index].closed_questions.indexOf(cq);
        cq.alternatives.forEach( alt => {
          let alt_index = original.groups[g_index].closed_questions[index_].alternatives.indexOf(alt);
          let alt_original = original.groups[g_index].closed_questions[index_].alternatives[alt_index];
          if (alt.counter !== alt_original.counter)
          {
            alt_original.counter += 1;
          }
        })
      })
    })
    this.surveys.saveAnswer(this.user_key, this.survey_key, this.ori_survey[0]);
    this.surveys.updateUserHasAnswered(this.user_key, this.survey_key, this.email, this.token);
    this.has_answered = true;
  }

  setOption(surv : Survey, group : Group, q : Question, alternative : Alternative, event : any)
  {
    // let sur_slice = this.survey.slice(this.survey.indexOf(surv), 1)[0];
    // let g_slice = sur_slice.groups.slice(sur_slice.groups.indexOf(group), 1)[0];
    // let q_slice = g_slice.closed_questions.slice(g_slice.closed_questions.indexOf(q))[0];
    // let alt = q_slice.alternatives.slice(q_slice.alternatives.indexOf(alternative))[0];
    // alt.counter = alt.counter + 1;
    console.log(event);
    // alternative.counter += 1;
  }

  setOptionWithAltIndex(q : Question, alt : Alternative, altindex : number, event : any)
  {
    q.alternatives.forEach( a => {
      if (a.counter > 0)
        if (a !== alt)
          a.counter = 0;
    })
    alt.counter += 1;
    // console.log(altindex, alt.counter)
  }

  setOpenQuestionText(q : QuestionOpen)
  {
    // console.log(q)
    q.responses
  }

}

/*
  https://stackoverflow.com/questions/28150967/typescript-cloning-object/42758108
*/