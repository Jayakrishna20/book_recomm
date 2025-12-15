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
      max-width: 1400px; /* Wider for cleaner look */
      margin: 0 auto;
      padding: 1.5rem 2rem;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    header {
      text-align: center;
      margin-bottom: 2rem;
      flex-shrink: 0;
    }
    
    h1 {
      font-family: var(--font-heading);
      font-size: 2.25rem; /* Further reduced from 2.5rem */
      font-weight: 700;
      color: var(--color-royal-blue);
      margin-bottom: 0.5rem;
      margin-top: 0;
      letter-spacing: -0.5px;
    }
    
    p {
      font-family: var(--font-body);
      color: #64748b;
      font-size: 0.95rem; /* Further reduced from 1rem */
      font-weight: 300;
      letter-spacing: 0.5px;
      margin: 0;
    }
    
    .grid-layout {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem; /* Further reduced gap */
      max-width: 800px; /* Further reduced from 900px */
      margin: 0 auto 1rem auto;
      flex-grow: 1;
      overflow: hidden;
      align-content: center;
      padding: 0 1rem;
      width: 100%;
    }
    
    .actions {
      display: flex;
      justify-content: center;
      margin-top: auto;
      padding-bottom: 3rem;
      flex-shrink: 0;
    }
    
    button {
      background: var(--color-royal-blue);
      color: var(--color-gold);
      border: 1px solid var(--color-gold);
      padding: 1rem 4rem;
      font-family: var(--font-body);
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
      border-radius: 4px; /* More regal, less playful */
      cursor: pointer;
      transition: all 0.4s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2);
      background: var(--color-dark);
      border-color: #fff;
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .loading-state {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
      font-family: var(--font-heading);
      font-size: 1.5rem;
      color: #94a3b8;
      font-style: italic;
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
