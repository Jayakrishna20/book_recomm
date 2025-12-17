import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root'
})
export class GoogleBooksService {
    private apiUrl = 'https://www.googleapis.com/books/v1/volumes';
    private cache = new Map<string, Observable<string | undefined>>();

    constructor(private http: HttpClient) { }

    getBookThumbnail(title: string, author: string): Observable<string | undefined> {
        const cacheKey = `${title}-${author}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        const query = `intitle:${title}+inauthor:${author}`;
        const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&maxResults=1`;

        const request$ = this.http.get<GoogleBooksResponse>(url).pipe(
            map(response => {
                const items = response.items;
                if (items && items.length > 0) {
                    const volumeInfo = items[0].volumeInfo;
                    return volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:').replace('&zoom=1', '&zoom=2') as string;
                }
                return undefined;
            }),
            catchError(() => of(undefined)),
            shareReplay(1)
        );

        this.cache.set(cacheKey, request$);
        return request$;
    }

    searchBooks(query: string): Observable<Book[]> {
        if (!query.trim()) {
            return of([]);
        }

        const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&maxResults=10`;

        return this.http.get<GoogleBooksResponse>(url).pipe(
            map(response => {
                if (!response.items) {
                    return [];
                }
                return response.items.map(item => this.mapToBook(item));
            }),
            catchError(error => {
                console.error('Error fetching books from Google Books API:', error);
                return of([]);
            })
        );
    }

    private mapToBook(item: GoogleBookItem): Book {
        const volumeInfo = item.volumeInfo;
        return {
            id: item.id,
            title: volumeInfo.title || 'No Title',
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
            genre: volumeInfo.categories ? volumeInfo.categories[0] : 'Unknown Genre',
            thumbnailUrl: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || undefined
        };
    }
}

// Interfaces for Google Books API Response
interface GoogleBooksResponse {
    kind?: string;
    totalItems?: number;
    items?: GoogleBookItem[];
}

interface GoogleBookItem {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        publisher?: string;
        publishedDate?: string;
        description?: string;
        categories?: string[];
        imageLinks?: {
            smallThumbnail?: string;
            thumbnail?: string;
        };
        language?: string;
        previewLink?: string;
        infoLink?: string;
        canonicalVolumeLink?: string;
    };
}
