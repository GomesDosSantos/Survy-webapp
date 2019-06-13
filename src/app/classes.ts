// Classes padrões
// import { Alternative, Question, QuestionOpen, Group, Survey, User } from './classes';

export class Alternative {
  text:     string;
  counter:  number = 0;
}

// https://www.typescriptlang.org/docs/handbook/classes.html -> poderia ser uma solução também
export class Question {
  title:        string;
  alternatives: Alternative[];
  is_multiple:  boolean = false;
}

export class QuestionOpen {
  title:      string;
  responses:  string[];
}

export class Group {
  title:            string;
  closed_questions: Question[];
  open_questions:   QuestionOpen[];
}

export class Survey {
  title:      string;
  subtitle:   string;
  views:      number = 0;
  groups:     Group[];
  start:      Date;
  end:        Date;
}

export class User {
  usuario: string;
  surveys: Survey[];
}

export class Answer {
  survey_key:   string;
  email:        string  = '';
  token:        string  = '';
  has_answered: boolean = false;
}





