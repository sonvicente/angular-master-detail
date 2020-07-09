import { Injectable, Injector } from '@angular/core';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from './entry.model';

import { BaseResourceService } from '../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

    constructor( protected injector: Injector, private categoryService: CategoryService ) {
        super('api/entries', injector, Entry.fromJson ); // Entry.fromJson passando a função para a classe super
    }


    create(entry: Entry): Observable<Entry> {
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap( category => {
                entry.category = category;
                return super.create(entry);
            })
        );
    }

    update(entry: Entry): Observable<Entry> {
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap( category => {
                entry.category = category;
                return super.update(entry);
            })
        );

    }
}
