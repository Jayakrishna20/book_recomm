import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookGridComponent } from './components/book-grid/book-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LitLoop';
}
