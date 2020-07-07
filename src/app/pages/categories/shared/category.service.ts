import { Injectable, Injector } from '@angular/core';
import { Category } from './category.model';

import { BaseResourceService } from '../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
// passa Category como tipo pra classe super
export class CategoryService extends BaseResourceService<Category> {

    // private apiPath = 'api/categories';

    constructor( protected injector: Injector ) {
        super('api/categories', injector );
    }

}
