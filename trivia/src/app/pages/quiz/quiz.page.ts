import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonRadio,
  IonRadioGroup,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ITriviaQuestion,
  TriviaApiService,
} from '../../services/trivia-api.service';
import { QuizService } from '../../services/quiz.service';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonBadge,
    IonProgressBar,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonRadioGroup,
    IonItem,
    IonLabel,
    IonRadio,
    IonSpinner,
  ],
})
export class QuizPage implements OnInit, OnDestroy {
  currentQuestion!: ITriviaQuestion;
  currentIndex: number = 0;
  totalQuestions: number = 0;
  score: number = 0;

  answerSelected: boolean = false;
  showFeedback: boolean = false;
  isCorrect: boolean = false;
  correctAnswer!: string;
  isLastQuestion: boolean = false;

  private quizSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private triviaApi: TriviaApiService,
    private quizService: QuizService,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    this.loadQuestions();

    this.quizSubscription = this.quizService
      .getGameState()
      .subscribe((state) => {
        if (state.questions.length > 0) {
          this.currentQuestion = state.questions[state.currentQuestionIndex];
          this.currentIndex = state.currentQuestionIndex;
          this.totalQuestions = state.totalQuestions;
          this.score = state.score;

          if (state.gameOver) {
            this.navigateToResults();
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.quizSubscription) {
      this.quizSubscription.unsubscribe();
    }
  }

  loadQuestions() {
    const amount = +(this.route.snapshot.queryParamMap.get('amount') || 10);
    const category = +(this.route.snapshot.queryParamMap.get('category') || 0);
    const difficulty =
      this.route.snapshot.queryParamMap.get('difficulty') || '';

    this.triviaApi
      .getQuestions(amount, category || undefined, difficulty || undefined)
      .subscribe((questions) => {
        const categoryName =
          questions.length > 0 ? questions[0].category : 'Mixed';
        const difficultyName = difficulty || 'Mixed';

        this.quizService.initGame(questions, categoryName, difficultyName);
      });
  }

  selectAnswer(answer: string) {
    if (this.answerSelected) return;

    this.answerSelected = true;
    this.showFeedback = true;

    const result = this.quizService.submitAnswer(answer);
    this.isCorrect = result.isCorrect;
    this.isLastQuestion = result.isLastQuestion;
    this.correctAnswer = result.correct_answer;
  }

  nextQuestion() {
    this.answerSelected = false;
    this.showFeedback = false;

    const radioGroup = document.querySelector('ion-radio-group');
    if (radioGroup) {
      (radioGroup as any).value = null;
    }
  }

  navigateToResults() {
    this.router.navigate(['/results']);
  }

  async confirmQuit() {
    const alert = await this.alertCtrl.create({
      header: 'Quitter le quiz?',
      message: 'Votre progression sera perdue.',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Quitter',
          handler: () => {
            this.quizService.reset();
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();
  }
}
