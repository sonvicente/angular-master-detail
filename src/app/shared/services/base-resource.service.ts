
import { BaseResourceModel } from '../models/base-resource.model';

import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// generics passa um tipo
export abstract class BaseResourceService<T extends BaseResourceModel>{

    protected http: HttpClient;

    constructor(
        protected apiPath: string,
        protected injector: Injector,
        protected jsonDataToResourceFn: (jsonData: any) => T // recebe jsonData devolve objeto tipo T
    ){
        this.http = injector.get(HttpClient);
    }

    getAll(): Observable<T[]>{
        return this.http.get(this.apiPath).pipe(
            map(this.jsonDataToResources.bind(this)),
            // passa pra funcao qual o this que deve ser usado
            // da classe que está sendo instanciada
            catchError(this.handelError)
        );
    }

    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handelError)
        );
    }

    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handelError)
        );
    }

    update(resource: T): Observable<T> {

        const url = `${this.apiPath}/${resource.id}`;

        return this.http.put(url, resource).pipe(
            map( () => resource ),
            catchError(this.handelError)
            /*
                map(this.jsonDataToResource)
                não dá pra ser com o map pois o in memory não retorna nada no put
            */
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;

        return this.http.delete(url).pipe(
            map( () => null ),
            catchError(this.handelError)
        );
    }


    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        // jsonData.forEach( element => resources.push(element as T));
        jsonData.forEach(
            element => resources.push( this.jsonDataToResourceFn(element) )
        );
        // instancia um obj e devolve um objeto instanciado
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        // return jsonData as T;
        return this.jsonDataToResourceFn(jsonData);
    }

    protected handelError(error: any): Observable<any> {
        console.log('ERRO: ', error);
        return throwError(error);
    }

}
