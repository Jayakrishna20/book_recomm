import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root'
})
export class RecommendationService {

    constructor() { }

    getRecommendations(allBooks: Book[], count: number = 4): Book[] {
        if (!allBooks || allBooks.length === 0) {
            return [];
        }

        // Shuffle books to ensure randomness
        const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
        const selected: Book[] = [];
        const usedGenres = new Set<string>();

        for (const book of shuffled) {
            if (selected.length >= count) {
                break;
            }

            // key logic: ensure unique genres
            if (!usedGenres.has(book.genre)) {
                selected.push(book);
                usedGenres.add(book.genre);
            }
        }

        // If we can't find 4 unique genres, fill with remaining random books
        // (Graceful degradation if CSV has few genres)
        if (selected.length < count) {
            for (const book of shuffled) {
                if (selected.length >= count) break;
                if (!selected.includes(book)) {
                    selected.push(book);
                }
            }
        }

        return selected;
    }
}
