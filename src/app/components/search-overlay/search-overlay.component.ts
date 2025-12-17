import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { GoogleBooksService } from '../../services/google-books.service';
import { Book } from '../../models/book.model';
import { HighlightPipe } from '../../pipes/highlight.pipe';

@Component({
    selector: 'app-search-overlay',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HighlightPipe],
    template: `
    @if (isOpen) {
      <div class="overlay-backdrop" (click)="closeOverlay()">
        <div class="search-container" (click)="$event.stopPropagation()">
          <div class="search-header">
            <input 
              #searchInput
              [formControl]="searchControl" 
              class="search-input" 
              placeholder="Search for books, authors..." 
              autoFocus
            >
          </div>
          
          <div class="search-results">
            @for (book of results; track book.id) {
              <div class="result-item">
                <img [src]="book.thumbnailUrl || 'assets/placeholder-book.png'" alt="Cover" class="book-thumb" onerror="this.src='assets/placeholder-book.png'">
                <div class="book-info">
                  <div class="book-title" [innerHTML]="book.title | highlight: searchControl.value!"></div>
                  <div class="book-author">{{ book.author }}</div>
                </div>
              </div>
            }
            @empty {
               @if (searchControl.value && !loading) {
                 <div class="no-results">No books found for "{{ searchControl.value }}"</div>
               }
            }
            
            @if (loading) {
               <div class="no-results">Searching...</div>
            }
          </div>
        </div>
      </div>
    }
  `,
    styleUrls: ['./search-overlay.component.css']
})
export class SearchOverlayComponent implements OnInit, OnDestroy {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @ViewChild('searchInput') searchInput!: ElementRef;

    searchControl = new FormControl('');
    results: Book[] = [];
    loading = false;
    private destroy$ = new Subject<void>();

    constructor(private googleBooksService: GoogleBooksService) { }

    ngOnInit() {
        this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(query => {
                if (!query || query.trim().length === 0) {
                    this.results = [];
                    this.loading = false;
                    return of([]);
                }
                this.loading = true;
                return this.googleBooksService.searchBooks(query);
            }),
            takeUntil(this.destroy$)
        ).subscribe(books => {
            this.results = books;
            this.loading = false;
        });
    }

    ngOnChanges() {
        if (this.isOpen) {
            setTimeout(() => {
                this.searchInput?.nativeElement?.focus();
            }, 50); // Small delay to allow render
        }
    }

    closeOverlay() {
        this.close.emit();
        this.searchControl.setValue(''); // Optional: clear on close
        this.results = [];
    }

    // Handle keyboard events globally when open
    // This is better handled by a HostListener
    @HostListener('document:keydown.escape', ['$event'])
    onKeydownHandler(event: KeyboardEvent) {
        if (this.isOpen) {
            this.closeOverlay();
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
