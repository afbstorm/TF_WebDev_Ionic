import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

export interface IGame {
  category: string;
  difficulty: string;
  score: number;
  total_questions: number;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  //? Propriété de connexion Sqlite
  private sqliteConnection!: SQLiteConnection;
  //? Propriété de connexion à la DB
  private db!: SQLiteDBConnection;
  //? Flag de readiness de la DB
  private isReady: boolean = false;

  constructor() {
    this.initDatabase();
  }

  async initDatabase() {
    try {
      //? Initialise la connexion Sqlite grace au capacitor
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
      //! Paramètres : Nom de la db, encryption, mode de fonctionnement, version, readOnly
      this.db = await this.sqliteConnection.createConnection(
        'quiz',
        false,
        'no-encryption',
        1,
        false,
      );
      //? Une fois la connexion effective, on ouvre la connexion à la db
      await this.db.open();

      await this.createTables();

      this.isReady = true;
    } catch (error) {
      console.error(
        `Erreur lors de l'initialisation de la base de donnée SQLite : ${error}`,
      );
    }
  }

  //! Méthode de création des différentes tables de la DB
  private async createTables() {
    await this.db.execute(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_games INTEGER,
      total_correct INTEGER)`);

    await this.db.execute(`
    CREATE TABLE IF NOT EXISTS game_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      difficulty TEXT,
      score INTEGER,
      total_questions INTEGER,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
  }

  //? Ajout d'une partie jouée dans la DB
  async addToHistory(game: IGame) {
    //? Si la db n'est pas prête (initilisée, connectée, ...) on attend simplement qu'elle le soit
    if (!this.isReady) {
      await this.initDatabase();
    }

    //? Création d'une requête pour injecter dans la DB les informations de la partie (IGame)
    //! Les ` ` (back ticks) définissent le scope de la requête et permet l'insertion des valeurs litérales ${}
    //! Les valeurs litérales entourées de ' ' (single quotes) sont des chaines de caractères
    //! Les " " (guillemets) ne fonctionnent pas.
    const query = `INSERT INTO game_history (category, difficulty, score, total_questions)
                    VALUES ('${game.category}', '${game.difficulty}', ${game.score}, ${game.total_questions})`;

    return await this.db.execute(query);
  }

  async getHistory() {
    if (!this.isReady) {
      await this.initDatabase();
    }

    return await this.db.query(`SELECT * FROM game_history ORDER BY date DESC`);
  }
}
