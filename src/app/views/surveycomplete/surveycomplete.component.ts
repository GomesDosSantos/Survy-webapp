import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { SurveyService } from '../../survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Alternative, Question, QuestionOpen, Group, Survey, User, Answer } from '../../classes';

@Component({
  selector: 'app-surveycomplete',
  templateUrl: './surveycomplete.component.html',
  styleUrls: ['./surveycomplete.component.css']
})
export class SurveyCompleteComponent implements OnInit {

  constructor(private router : Router, private route : ActivatedRoute, private auth : AuthService, private surveys : SurveyService) { }

  private qid : string
  private link_to_survey : string;
  
  private survey_addresses: Array<Answer>;

  ngOnInit() {
    this.auth.checkLogin();

    this.route.params.subscribe( p => {
      this.qid = p.id;
      this.link_to_survey = `https://pfinal-webapp.stackblitz.io/answer/${this.qid}`
    })
    this.survey_addresses = new Array<Answer>();
    this.survey_addresses.push(new Answer())
    console.log(this.qid)
  }

  addUser()
  {
    this.survey_addresses.push(new Answer());
  }

  goToHome()
  {
    this.router.navigate(['home']);
  }

  saveAnswer()
  {
    // remove itens sem endereço de e-mail
    this.survey_addresses = this.survey_addresses.filter( ans => ans.email.trim().length > 0);
    this.survey_addresses.forEach( ans => {
      ans.survey_key = this.qid;
    })
    this.surveys.insertAnswer(this.auth.getInfoCurrentUser().uid, this.survey_addresses)
    .then( s => {
      console.log(s);
    })
    .catch( e => {console.log(e)})
  }

  saveAndGoToHome()
  {
    this.saveAnswer();
    // this.goToHome();
  }

  createLinkToSurvey(us : Answer)
  {
    return `https://pfinal-webapp.stackblitz.io/answer/${this.auth.getInfoCurrentUser().uid}/${us.survey_key}/${us.email}/${us.token}`;
  }

  copyToClipboard(us : Answer)
  {
    if (!us.token)
      return;
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    //
    selBox.value = this.createLinkToSurvey(us);
    //
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    alert('Copiado');
  }

  getLinkSurvey(email : string, key : string, salt : number, s_addr : Answer)
  {
    let token = 0;
    if (email && !email.length)
      return token;
    if (!key.length && salt <= 0)
      return token;
    for (let i = 0; i < email.length; ++i)
    {
      token += email.charCodeAt(i);
    }
    for (let i = 0; i < key.length; ++i)
    {
      token += key.charCodeAt(i);
    }
    token = Math.round(token * salt * Math.random());
    //return token;
    s_addr.token = String(token);
  }


}