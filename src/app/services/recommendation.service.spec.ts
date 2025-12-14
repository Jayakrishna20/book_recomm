import { TestBed } from '@angular/core/testing';
import { RecommendationService } from './recommendation.service';
import { Book } from '../models/book.model';

describe('RecommendationService', () => {
    let service: RecommendationService;

    const mockBooks: Book[] = [
        { id: '1', title: 'A', author: 'A', genre: 'Sci-Fi' },
        { id: '2', title: 'B', author: 'B', genre: 'Sci-Fi' },
        { id: '3', title: 'C', author: 'C', genre: 'Fantasy' },
        { id: '4', title: 'D', author: 'D', genre: 'Horror' },
        { id: '5', title: 'E', author: 'E', genre: 'Romance' },
        { id: '6', title: 'F', author: 'F', genre: 'Mystery' },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RecommendationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return 4 books by default', () => {
        const result = service.getRecommendations(mockBooks);
        expect(result.length).toBe(4);
    });

    it('should prioritize distinct genres', () => {
        // We have genres: Sci-Fi, Sci-Fi, Fantasy, Horror, Romance, Mystery
        // Ideally it selects one Sci-Fi and the others.
        const result = service.getRecommendations(mockBooks);
        const genres = result.map(b => b.genre);
        const uniqueGenres = new Set(genres);
        // With 5 distinct genres available and 4 slots, likely all 4 are unique.
        // If logic is perfect, we expect size equal to length (unless not enough distinct genres exist)
        expect(uniqueGenres.size).toBe(4);
    });

    it('should handle fewer books than count', () => {
        const smallList = mockBooks.slice(0, 2);
        const result = service.getRecommendations(smallList);
        expect(result.length).toBe(2);
    });

    it('should return empty array if no books provided', () => {
        expect(service.getRecommendations([])).toEqual([]);
    });
});
