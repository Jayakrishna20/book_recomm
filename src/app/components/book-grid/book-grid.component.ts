import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../book-card/book-card.component';
import { CsvService } from '../../services/csv.service';
import { RecommendationService } from '../../services/recommendation.service';
import { GoogleBooksService } from '../../services/google-books.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-grid',
  standalone: true,
  imports: [CommonModule, BookCardComponent],
  template: `
    <div class="container">
      <header>
        <h1>Next Read</h1>
        <p>Discover your next favorite book based on diverse genres.</p>
      </header>
      
      <div class="grid-layout" *ngIf="currentRecommendations.length > 0; else loading">
        <app-book-card *ngFor="let book of currentRecommendations; trackBy: trackByBookId" [book]="book"></app-book-card>
      </div>
      
      <ng-template #loading>
        <div class="loading-state">
          <p>Loading library...</p>
        </div>
      </ng-template>
      
      <div class="actions">
        <button (click)="recommendNewBooks()" [disabled]="isLoading">
          <span *ngIf="!isLoading">Recommend Me</span>
          <span *ngIf="isLoading">Shuffling...</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    header {
      text-align: center;
      margin-bottom: 1rem;
      flex-shrink: 0;
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.25rem;
      margin-top: 0.5rem;
    }
    
    p {
      color: #64748b;
      font-size: 1rem;
      margin: 0;
    }
    
    .grid-layout {
      display: grid;
      grid-template-columns: repeat(4, 1fr); /* Force 4 columns */
      gap: 1.5rem;
      margin-bottom: 1rem;
      flex-grow: 1;
      overflow: hidden;
      align-content: center; /* Center grid content vertically */
    }
    
    .actions {
      display: flex;
      justify-content: center;
      margin-top: auto;
      padding-bottom: 3rem;
      flex-shrink: 0;
    }
    
    button {
      background: #0f172a;
      color: white;
      border: none;
      padding: 1rem 3rem;
      font-size: 1.2rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.3);
      background: #1e293b;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .loading-state {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
      font-size: 1.5rem;
      color: #94a3b8;
    }
  `]
})
export class BookGridComponent implements OnInit {
  allBooks: Book[] = [];
  currentRecommendations: Book[] = [];
  isLoading = false;

  constructor(
    private csvService: CsvService,
    private recommendationService: RecommendationService,
    private googleBooksService: GoogleBooksService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.csvService.getBooks().subscribe({
      next: (books) => {
        this.allBooks = books;
        this.recommendNewBooks();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load CSV', err);
        this.isLoading = false;
      }
    });
  }

  recommendNewBooks() {
    this.currentRecommendations = this.recommendationService.getRecommendations(this.allBooks);
    this.enrichBooks(this.currentRecommendations);
  }

  enrichBooks(books: Book[]) {
    books.forEach(book => {
      // Don't re-fetch if we already have it (basic optimization)
      if (book.thumbnailUrl) return;

      this.googleBooksService.getBookThumbnail(book.title, book.author).subscribe(url => {
        if (url) {
          book.thumbnailUrl = url;
        }
      });
    });
  }

  trackByBookId(index: number, book: Book): string {
    return book.id;
  }
}
