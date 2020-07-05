import { Component, OnInit } from '@angular/core';
import { error, element } from 'protractor';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { Observable} from 'rxjs';

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

        this.entries$ = this.entryService.getAll();
    }

    deleteEntry(entry: Entry){

        const mustDelete = confirm('deletar?');

        if (mustDelete) {
            this.entryService.delete(entry.id).subscribe(
                () => this.entries = this.entries.filter( entrada => entrada !== entry ),
                () => alert('erro delete')
            );
        }
    }

}
