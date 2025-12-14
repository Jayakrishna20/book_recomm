import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CsvService } from './csv.service';

describe('CsvService', () => {
    let service: CsvService;
    let httpMock: HttpTestingController;

    const mockCsvData = `id,title,author,genre
1,Test Book,Test Author,Test Genre`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CsvService]
        });
        service = TestBed.inject(CsvService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should parse CSV data correctly', () => {
        service.getBooks().subscribe(books => {
            expect(books.length).toBe(1);
            expect(books[0].title).toBe('Test Book');
            expect(books[0].author).toBe('Test Author');
            expect(books[0].genre).toBe('Test Genre');
        });

        const req = httpMock.expectOne('assets/books.csv');
        expect(req.request.method).toBe('GET');
        req.flush(mockCsvData);
    });
});
