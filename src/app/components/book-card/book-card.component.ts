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
        <img [src]="book.thumbnailUrl || 'assets/placeholder-book.svg'" [alt]="book.title" loading="lazy">
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
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .book-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
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
      transition: transform 0.3s;
    }
    
    .book-card:hover img {
      transform: scale(1.05);
    }
    
    .genre-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
      backdrop-filter: blur(4px);
    }
    
    .info {
      padding: 1rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    h3 {
      font-size: 1.1rem;
      margin: 0 0 0.5rem 0;
      color: #333;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .author {
      font-size: 0.9rem;
      color: #666;
      margin: 0;
      margin-top: auto;
    }
  `]
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;
}
