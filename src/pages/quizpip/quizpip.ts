import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { IonicService } from '../../providers/ionic.service';
import { Question } from '../../model/question';
import { ResultQuestionnairePage } from '../../pages/resultQuestionnaire/resultQuestionnaire'
@Component({
  selector: 'page-quizpippage',
  templateUrl: './quizpip.html'
})
export class QuizPipPage {
  public questions: Array<Question>;
  public userAnswers  = [];
  public userMultiAnswers  = [];
  public comprobacion:number;
  public questionTime:number;
  public questionnaireTime:number;
  public displayTime: string;
  public timer;
  constructor(
    public navParams: NavParams,
    public navController: NavController,
    public ionicService: IonicService,
    public translateService: TranslateService) {
    this.questions = this.navParams.data.question;
    this.questionTime = this.navParams.data.questiontime;
    this.questionnaireTime = this.navParams.data.questionnairetime;
  }

  public saveAnswer(data:string,indice:number){
    this.userAnswers[indice] = data;
  }

  public saveMultiAnswer(answer:string,indexUserAnswer:number,indexMultipleAnswer:number){
    if (this.userAnswers[indexUserAnswer])
    {
      this.userMultiAnswers = this.userAnswers[indexUserAnswer];
    }
    else
    {
      this.userMultiAnswers = [];
    }
    //TO DELETE THE INFORMATION OF THE POSITION
    if ( this.userMultiAnswers[indexMultipleAnswer] === answer)
    {
      this.userMultiAnswers[indexMultipleAnswer] = "";
      this.userAnswers[indexUserAnswer] = this.userMultiAnswers;
    }
    else
    {
      this.userMultiAnswers[indexMultipleAnswer] = answer;
      this.userAnswers[indexUserAnswer] = this.userMultiAnswers;
    }
  }

  public ionViewDidEnter(): void {
    this.ionicService.removeLoading();
  }

  public doSubmitAnswer() {
    clearTimeout(this.timer);
    this.navController.setRoot(ResultQuestionnairePage,
      {questions: this.questions,
        answers: this.userAnswers,
        questionnaireGame: this.navParams.data.questionnaireGame });

      }
  /**
   *  TIMER START
   */
  ngOnInit() {
    this.initTimer();
  }

  initTimer() {
    var time = 0;
    if (this.questionTime){
        time = this.questionTime;
    }
    else if (this.questionnaireTime)
    {
      time = this.questionnaireTime;
    }
    else {
      return;
    }
    this.displayTime = this.getSecondsAsDigitalClock(time);
    this.timerTick(time);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  timerTick(time:number) {
    this.timer = setTimeout(() => {
      time--;
      this.displayTime = this.getSecondsAsDigitalClock(time);
      if (time > 0) {
        this.timerTick(time);
      }
      else {
          this.doSubmitAnswer();
      }
    }, 1000);
  }
}


