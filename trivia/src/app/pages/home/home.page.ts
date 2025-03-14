import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TriviaApiService } from '../../services/trivia-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    IonItem,
    IonCardTitle,
    IonCardContent,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonRange,
    IonButton,
  ],
})
export class HomePage implements OnInit {
  categories: { id: number; name: string }[] = [];
  selectedCategory: number = 0;
  selectedDifficulty: string = '';
  questionCount: number = 10;

  constructor(
    private triviaApi: TriviaApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.triviaApi.getCategories().subscribe((data) => {
      this.categories = data.trivia_categories;
    });
  }

  startQuiz() {
    this.router.navigate(['/quiz'], {
      queryParams: {
        amount: this.questionCount,
        category: this.selectedCategory !== 0 ? this.selectedCategory : null,
        difficulty:
          this.selectedDifficulty !== '' ? this.selectedDifficulty : null,
      },
    });
  }

  viewHistory() {
    this.router.navigate(['/history']);
  }
}
