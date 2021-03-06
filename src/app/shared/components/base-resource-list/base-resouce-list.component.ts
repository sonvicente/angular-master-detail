import { OnInit } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

import { Observable} from 'rxjs';
import { map, tap, catchError, flatMap } from 'rxjs/operators';


export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

    resources: T[] = [];
    // entries$: Observable<Entry[]>;

    constructor(
        private resourceService: BaseResourceService<T>
    ) { }

    ngOnInit() {
        this.resourceService.getAll().subscribe(
            resources => this.resources = resources.sort((a,b) => b.id - a.id),
            error => alert('Erro ao carregar a lista')
        );
    }

    deleteResource(resource: T){

        const mustDelete = confirm('deletar?');

        if (mustDelete) {
            this.resourceService.delete(resource.id).subscribe(
                () => this.resources = this.resources.filter( element => element !== resource ),
                () => alert('erro delete'),
                // () => this.getEntries()
            );
        }
    }


    // getEntries(){
    //     this.entries$ = this.entryService.getAll()
    //         .pipe(
    //             // ordenar id desc
    //             // map(results => results.sort( (a, b) => b.id - a.id) )
    //             // sort modifies existing array, it's more semantically correct to provide side effects in do/tap:
    //             tap(results => results.sort( (a, b) => b.id - a.id) )
    //         );
    // }

}
