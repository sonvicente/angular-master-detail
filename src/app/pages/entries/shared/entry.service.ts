import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Entry } from './entry.model';


@Injectable({
  providedIn: 'root'
})
export class EntryService {

    private apiPath = 'api/entries';

    constructor( private http: HttpClient ) { }

    getAll(): Observable<Entry[]>{
        return this.http.get(this.apiPath).pipe(
            catchError(this.handelError),
            map(this.jsonDataToEntries)
        );
    }

    getById(id: number): Observable<Entry> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            catchError(this.handelError),
            map(this.jsonDataToEntry)
        );
    }

    create(entry: Entry): Observable<Entry> {
        return this.http.post(this.apiPath, entry).pipe(
            catchError(this.handelError),
            map(this.jsonDataToEntry)
        );
    }

    update(entry: Entry): Observable<Entry> {

        const url = `${this.apiPath}/${entry.id}`;

        return this.http.put(url, entry).pipe(
            catchError(this.handelError),
            map( () => entry )
            // map(this.jsonDataToEntry)
            // não dá pra ser assim pois o in memory não retorna nada no put
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;

        return this.http.delete(url).pipe(
            catchError(this.handelError),
            map( () => null )
        );
    }

    private jsonDataToEntries(jsonData: any[]): Entry[] {

        const entries: Entry[] = [];

        jsonData.forEach( element => entries.push(element as Entry));
        return entries;
    }

    private jsonDataToEntry(jsonData: any): Entry {
        return jsonData as Entry;
    }

    private handelError(error: any): Observable<any> {
        console.log('ERRO: ', error);
        return throwError(error);
    }

}
