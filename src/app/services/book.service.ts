import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://localhost:5000/api/books'; // Adjust if port differs

    constructor(private http: HttpClient) { }

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl);
    }

    addBook(book: Partial<Book>): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book);
    }

    deleteBook(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
