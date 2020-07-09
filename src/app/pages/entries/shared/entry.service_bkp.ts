import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Entry } from './entry.model';

import { CategoryService } from '../../categories/shared/category.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

    private apiPath = 'api/entries';

    constructor(
        private http: HttpClient,
        private categoryService: CategoryService) { }

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
/*
        A API retornaria tudo da categoria
        gambiarra feita por causa da fake API in-memory
        com map Observable<Observable<entry>>
        com flatMap Observable<entry>
*/
        return this.categoryService.getById(entry.categoryId).pipe(
            // flatMap achata os obsevables
            flatMap( category => {
                entry.category = category;

                // Observable<entry>
                return this.http.post(this.apiPath, entry).pipe(
                    catchError(this.handelError),
                    map(this.jsonDataToEntry)
                );
            })
        );
/*
        return this.http.post(this.apiPath, entry).pipe(
            catchError(this.handelError),
            map(this.jsonDataToEntry)
        );
*/
    }

    update(entry: Entry): Observable<Entry> {

        const url = `${this.apiPath}/${entry.id}`;

        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap( category => {
                entry.category = category;

                return this.http.put(url, entry).pipe(
                    catchError(this.handelError),
                    map( () => entry )
                );
            })
        );

/*
        return this.http.put(url, entry).pipe(
            catchError(this.handelError),
            map( () => entry )
            // map(this.jsonDataToEntry)
            // não dá pra ser assim pois o in memory não retorna nada no put
        );
*/
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

        jsonData.forEach( element => {
            // precisa criar o objeto para pode pegar o getter no html
            const entry = Object.assign( new Entry(), element);
            entries.push(entry);
        });

        return entries;
    }

    private jsonDataToEntry(jsonData: any): Entry {
        return Object.assign( new Entry(), jsonData);
        // return jsonData as Entry;
    }

    private handelError(error: any): Observable<any> {
        console.log('ERRO: ', error);
        return throwError(error);
    }

}
