import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Papa from 'papaparse';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root'
})
export class CsvService {

    constructor(private http: HttpClient) { }

    getBooks(): Observable<Book[]> {
        return this.http.get('assets/books.csv', { responseType: 'text' }).pipe(
            map(data => {
                const parsed = Papa.parse(data, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => header.trim().toLowerCase()
                });

                return parsed.data.map((row: any) => ({
                    id: row.id || crypto.randomUUID(), // Fallback ID
                    title: row.title,
                    author: row.author,
                    genre: row.genre
                } as Book));
            })
        );
    }
}
