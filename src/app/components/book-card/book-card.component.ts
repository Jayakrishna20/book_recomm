import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="book-card">
      <div class="image-container">
        <img [src]="book.thumbnailUrl || 'assets/placeholder-book.svg'" [alt]="book.title" loading="lazy" (error)="onImageError($event)">
        <div class="genre-tag">{{ book.genre }}</div>
      </div>
      <div class="info">
        <h3>{{ book.title }}</h3>
        <p class="author">by {{ book.author }}</p>
      </div>
    </div>
  `,
  styles: [`
    .book-card {
      background: white;
      border-radius: 8px; /* Slightly sharper for elegance */
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      height: 100%;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(0,0,0,0.03);
    }
    
    .book-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
      border-color: var(--color-gold-light);
    }
    
    .image-container {
      position: relative;
      width: 100%;
      padding-top: 150%; /* 2:3 Aspect Ratio */
      background: #f0f0f0;
      overflow: hidden;
    }
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
    
    .book-card:hover img {
      transform: scale(1.03);
    }
    
    .genre-tag {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(255, 255, 255, 0.95);
      color: var(--color-royal-blue);
      padding: 6px 12px;
      border-radius: 2px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      backdrop-filter: blur(4px);
      border-bottom: 2px solid var(--color-gold);
    }
    
    .info {
      padding: 0.75rem; /* Reduced padding to make room for text on small cards */
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    
    h3 {
      font-family: var(--font-heading);
      font-size: 0.9rem; /* Slightly smaller */
      margin: 0 0 0.25rem 0; /* Tighter margin */
      color: var(--color-royal-blue);
      line-height: 1.2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-weight: 700;
      height: 2.4em; /* Fixed height for 2 lines to prevent layout shift */
    }
    
    .author {
      font-family: var(--font-body);
      font-size: 0.7rem;
      color: #94a3b8;
      margin: 0;
      margin-top: auto;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 400;
    }
  `]
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;

  onImageError(event: any) {
    event.target.src = 'assets/placeholder-book.svg';
  }
}
