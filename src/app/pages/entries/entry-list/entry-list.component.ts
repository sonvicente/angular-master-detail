import { Component, OnInit } from '@angular/core';
import { error, element } from 'protractor';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { Observable} from 'rxjs';
import { map, tap, catchError, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

    entries: Entry[] = [];

    entries$: Observable<Entry[]>;

    constructor(
        private entryService: EntryService
    ) { }

    ngOnInit(): void {
        // this.entryService.getAll().subscribe(
        //     entries => this.entries = entries,
        //     error => alert('erro listar')
        // );

        this.getEntries();
    }

    getEntries(){
        this.entries$ = this.entryService.getAll()
            .pipe(
                // ordenar id desc
                // map(results => results.sort( (a, b) => b.id - a.id) )
                // sort modifies existing array, it's more semantically correct to provide side effects in do/tap:
                tap(results => results.sort( (a, b) => b.id - a.id) )
            );
    }

    deleteEntry(entry: Entry){




        const mustDelete = confirm('deletar?');



        if (mustDelete) {
            this.entryService.delete(entry.id).subscribe(
                // () => this.entries = this.entries.filter( entrada => entrada !== entry ),
                () => alert('erro delete'),
                () => this.getEntries()
            );
        }
    }

}
