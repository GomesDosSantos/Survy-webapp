import { Injectable } from '@angular/core';
import { Alternative, Question, QuestionOpen, Group, Survey, User, Answer } from './classes';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';

@Injectable()
export class SurveyService {

  public user_i : any;

  private s_l = 'survy/user/';

  constructor(private database : AngularFireDatabase) {}

  getAllSurveys(user_id : string)
  {
    return this.database.list(`survy/user/${user_id}/`)
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val()}))
        })
      )
  }

  insertSurvey(user_id : string, survey : Survey) {
    return this.database.list(`survy/user/${user_id}/surveys`).push(survey)
  }

  getSurvey(survey_id : string)
  {
    return this.database.list(`survy/user/surveys/${survey_id}`)
      .valueChanges()
  }

  updateSurvey(user_key : string, survey_key : string, survey : Survey)
  {
    // console.log(user_key, survey_key, survey);
    return this.database.list(`survy/user/${user_key}/surveys`).update(survey_key, survey);
  }

  deleteSurvey(user_id : string, survey_key : string)
  {
    return this.database.list(`survy/user/${user_id}/surveys/${survey_key}`).remove();
  }

  insertAnswer(survey_key : string, answers : Answer[])
  {
    return this.database.list(`survy/answer/`).set(survey_key, answers);
  }

  getSurveyWithUserid(user_id : string, survey_id : string)
  {
    return this.database.list(`survy/user/${user_id}/surveys/${survey_id}`)
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val()}))
        })
      )
  }

  getAnswer(user_key : string, survey_key : string)
  {
    return this.database.list(`survy/answer/${user_key}`,
      ref => ref.orderByChild('survey_key').equalTo(survey_key)
      )
      .snapshotChanges()
        .pipe(
          map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val()}))
          })
        )
  }

  saveAnswer(user_key : string, survey_key : string, survey : Survey)
  {
    // console.log(user_key, survey_key, survey);
    return this.database.list(`survy/user/${user_key}/surveys`).update(survey_key, survey);
  }

  updateUserHasAnswered(user_key : string, survey_key : string, email : string, token : string)
  {
    let answer = this.getAnswer(user_key, survey_key);
    let index = 0;
    answer.forEach( a => {
      a.forEach( ans => {
        if (ans.email === email && ans.token === token)
        {
          // console.log(ans)
          this.database.list(`survy/answer/${user_key}/${index}`).set('has_answered', true);
        }
        index += 1;
      })
    })
  }

  convertToSurvey(s : any, filtering_key : string = null) : Survey[]
  {
    // console.log(s)
    let survey_array = new Array<Survey>();
    let sur_key = Object.keys(s).filter((i) => i !== "key");
    //console.log(sur_key, s[sur_key])
    sur_key.forEach( key => {
      // console.log(key);
      if (filtering_key !== null)
      {
        if (key !== filtering_key)
          return;
      }
      let survey : Survey = new Survey();
      survey.key = key;
      sur_key = s[key];
      survey.title = sur_key.title;
      survey.groups = new Array<Group>();
      sur_key.groups.forEach( group => {
        // survey.groups.push()
        let gg = new Group();
        gg.title = group.title;
        let cqs = new Array<Question>();
        let oqs = new Array<QuestionOpen>();
        group.closed_questions.forEach( cq => {
          //console.log('cq', cq)
          let ques = new Question();
          ques.alternatives = new Array<Alternative>();
          ques.title = cq.title;
          ques.is_multiple = cq.is_multiple !== undefined ? cq.is_multiple : false;
          cq.alternatives.forEach( r => {     
            let alt = new Alternative();
            alt.text = r.text;
            alt.counter = r.counter;
            ques.alternatives.push(alt);
          })
          cqs.push(ques);
        })
        gg.closed_questions = cqs;
        group.open_questions.forEach( op => {
          //console.log('op', op)
          let ques = new QuestionOpen();
          ques.title = op.title;
          ques.responses = new Array<string>();
          if (op.responses)
            op.responses.forEach( r => {
              ques.responses.push(r);
            })
          oqs.push(ques);
        })
        gg.open_questions = oqs;
        survey.groups.push(gg);
        // survey_array.push(survey);
        //console.log(survey_array)
      })
      survey_array.push(survey);
    })
    //console.log(survey);
    return survey_array;
  }


}