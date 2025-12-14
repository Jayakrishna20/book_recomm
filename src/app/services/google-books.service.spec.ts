import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GoogleBooksService } from './google-books.service';

describe('GoogleBooksService', () => {
    let service: GoogleBooksService;
    let httpMock: HttpTestingController;

    const mockResponse = {
        items: [
            {
                volumeInfo: {
                    imageLinks: {
                        thumbnail: 'http://example.com/image.jpg'
                    }
                }
            }
        ]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GoogleBooksService]
        });
        service = TestBed.inject(GoogleBooksService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch book thumbnail and upgrade to https', () => {
        service.getBookThumbnail('Title', 'Author').subscribe(url => {
            expect(url).toBe('https://example.com/image.jpg');
        });

        const req = httpMock.match(req => req.url.includes('googleapis.com'));
        expect(req.length).toBe(1);
        req[0].flush(mockResponse);
    });

    it('should return undefined if no items found', () => {
        service.getBookThumbnail('Unknown', 'Unknown').subscribe(url => {
            expect(url).toBeUndefined();
        });

        const req = httpMock.match(req => req.url.includes('googleapis.com'));
        expect(req.length).toBe(1);
        req[0].flush({ totalItems: 0 });
    });
});
