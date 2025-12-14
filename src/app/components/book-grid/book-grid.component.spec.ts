import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookGridComponent } from './book-grid.component';
import { CsvService } from '../../services/csv.service';
import { GoogleBooksService } from '../../services/google-books.service';
import { RecommendationService } from '../../services/recommendation.service';
import { of } from 'rxjs';
import { Book } from '../../models/book.model';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BookGridComponent', () => {
    let component: BookGridComponent;
    let fixture: ComponentFixture<BookGridComponent>;
    let mockCsvService: jasmine.SpyObj<CsvService>;
    let mockGoogleService: jasmine.SpyObj<GoogleBooksService>;
    let mockRecommendationService: jasmine.SpyObj<RecommendationService>;

    const mockBooks: Book[] = [
        { id: '1', title: 'A', author: 'A', genre: 'G1' },
        { id: '2', title: 'B', author: 'B', genre: 'G2' },
    ];

    beforeEach(async () => {
        mockCsvService = jasmine.createSpyObj('CsvService', ['getBooks']);
        mockGoogleService = jasmine.createSpyObj('GoogleBooksService', ['getBookThumbnail']);
        mockRecommendationService = jasmine.createSpyObj('RecommendationService', ['getRecommendations']);

        mockCsvService.getBooks.and.returnValue(of(mockBooks));
        mockRecommendationService.getRecommendations.and.returnValue(mockBooks);
        mockGoogleService.getBookThumbnail.and.returnValue(of('test-url'));

        await TestBed.configureTestingModule({
            imports: [BookGridComponent, HttpClientTestingModule],
            providers: [
                { provide: CsvService, useValue: mockCsvService },
                { provide: GoogleBooksService, useValue: mockGoogleService },
                { provide: RecommendationService, useValue: mockRecommendationService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BookGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load books on init', () => {
        expect(mockCsvService.getBooks).toHaveBeenCalled();
        expect(component.allBooks.length).toBe(2);
    });

    it('should recommend books and enrich them', () => {
        expect(mockRecommendationService.getRecommendations).toHaveBeenCalled();
        expect(mockGoogleService.getBookThumbnail).toHaveBeenCalledTimes(2); // For each book
    });

    it('should refresh recommendations on button click', () => {
        const btn = fixture.debugElement.query(By.css('button'));
        btn.triggerEventHandler('click', null);
        expect(mockRecommendationService.getRecommendations).toHaveBeenCalledTimes(2); // Init + Click
    });
});
