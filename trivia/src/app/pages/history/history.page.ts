import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemSliding,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { DatabaseService } from '../../services/database.service';
import { AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChart } from 'ionicons/icons';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonBadge,
    IonIcon,
    IonFab,
    IonFabButton,
  ],
})
export class HistoryPage implements OnInit {
  gameHistory: any[] = [];

  constructor(
    private dbService: DatabaseService,

    private alertCtrl: AlertController,
  ) {
    addIcons({ statsChart });
  }

  ngOnInit() {
    this.loadHistory();
  }

  async loadHistory() {
    const result = await this.dbService.getHistory();
    this.gameHistory = result.values || [];
  }

  calculatePercentage(score: number, total: number): number {
    return Math.round((score / total) * 100);
  }

  getBadgeColor(score: number, total: number): string {
    const percentage = this.calculatePercentage(score, total);
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'secondary';
    if (percentage >= 40) return 'warning';
    return 'danger';
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  async showStats() {
    let totalGames = this.gameHistory.length;

    let totalScore = this.gameHistory.reduce(
      (sum, game) => sum + game.score,
      0,
    );

    let totalQuestions = this.gameHistory.reduce(
      (sum, game) => sum + game.total_questions,
      0,
    );

    let avgScore =
      totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    const alert = await this.alertCtrl.create({
      header: 'Statistiques',
      message: `
        Parties jouées: ${totalGames}<br>
        Score moyen: ${avgScore}%<br>
        Total de questions: ${totalQuestions}<br>
        Bonnes réponses: ${totalScore}
      `,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
