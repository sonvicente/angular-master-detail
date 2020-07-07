
import { BaseResourceModel } from '../models/base-resource.model';

import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// generics passa um tipo
export abstract class BaseResourceService<T extends BaseResourceModel>{

    protected http: HttpClient;

    constructor(protected apiPath: string, protected injector: Injector) {
        this.http = injector.get(HttpClient);
    }

    getAll(): Observable<T[]>{
        return this.http.get(this.apiPath).pipe(
            catchError(this.handelError),
            map(this.jsonDataToResources)
        );
    }

    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            catchError(this.handelError),
            map(this.jsonDataToResource)
        );
    }

    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            catchError(this.handelError),
            map(this.jsonDataToResource)
        );
    }

    update(resource: T): Observable<T> {

        const url = `${this.apiPath}/${resource.id}`;

        return this.http.put(url, resource).pipe(
            catchError(this.handelError),
            map( () => resource )
            // map(this.jsonDataToResource)
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


    protected jsonDataToResources(jsonData: any[]): T[] {

        const resources: T[] = [];

        jsonData.forEach( element => resources.push(element as T));
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        return jsonData as T;
    }

    protected handelError(error: any): Observable<any> {
        console.log('ERRO: ', error);
        return throwError(error);
    }

}
