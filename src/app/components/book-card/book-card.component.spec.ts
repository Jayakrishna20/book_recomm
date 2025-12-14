import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCardComponent } from './book-card.component';
import { Book } from '../../models/book.model';
import { By } from '@angular/platform-browser';

describe('BookCardComponent', () => {
    let component: BookCardComponent;
    let fixture: ComponentFixture<BookCardComponent>;

    const mockBook: Book = {
        id: '1',
        title: 'Test Title',
        author: 'Test Author',
        genre: 'Test Genre',
        thumbnailUrl: 'test-url.jpg'
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BookCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BookCardComponent);
        component = fixture.componentInstance;
        component.book = mockBook;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display book title and author', () => {
        const titleEl = fixture.debugElement.query(By.css('h3')).nativeElement;
        const authorEl = fixture.debugElement.query(By.css('.author')).nativeElement;

        expect(titleEl.textContent).toContain('Test Title');
        expect(authorEl.textContent).toContain('Test Author');
    });

    it('should display genre tag', () => {
        const genreEl = fixture.debugElement.query(By.css('.genre-tag')).nativeElement;
        expect(genreEl.textContent).toContain('Test Genre');
    });

    it('should use placeholder image if thumbnailUrl is missing', () => {
        component.book = { ...mockBook, thumbnailUrl: undefined };
        fixture.detectChanges();
        const imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
        expect(imgEl.src).toContain('assets/placeholder-book.svg');
    });
});
