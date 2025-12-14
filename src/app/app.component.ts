import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookGridComponent } from './components/book-grid/book-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookGridComponent],
  template: `
    <app-book-grid></app-book-grid>
  `,
  styles: []
})
export class AppComponent { }
