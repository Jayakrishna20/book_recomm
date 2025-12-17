import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookGridComponent } from './components/book-grid/book-grid.component';
import { FabComponent } from './components/fab/fab.component';
import { SearchOverlayComponent } from './components/search-overlay/search-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookGridComponent, FabComponent, SearchOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LitLoop';
  isSearchOpen = false;

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  closeSearch() {
    this.isSearchOpen = false;
  }
}
