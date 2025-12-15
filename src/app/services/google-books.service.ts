import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

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

        const request$ = this.http.get<any>(url).pipe(
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
}
