import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
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
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { QuizService, IQuiz } from '../../services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonProgressBar,
    IonLabel,
    IonIcon,
    IonButton,
    IonList,
    IonItem,
  ],
})
export class ResultsPage implements OnInit {
  score: number = 0;
  totalQuestions: number = 0;
  category: string = '';
  difficulty: string = '';
  answers: any[] = [];

  constructor(
    private quizService: QuizService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.quizService.getGameState().subscribe((state: IQuiz) => {
      this.score = state.score;
      this.totalQuestions = state.totalQuestions;
      this.category = state.category;
      this.difficulty = state.difficulty;
      this.answers = state.answers;
    });
  }

  getScorePercentage() {
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  getScoreColor() {
    const percentage = this.getScorePercentage();
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'secondary';
    if (percentage >= 40) return 'warning';
    return 'danger';
  }

  playAgain() {
    this.quizService.reset();
    this.router.navigate(['/home']);
  }

  goHome() {
    this.quizService.reset();
    this.router.navigate(['/home']);
  }
}
