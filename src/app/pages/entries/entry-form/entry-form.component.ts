import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resouce-form.component'

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

    categories: Array<Category>;

    imaskConfig = {
        mask: Number,
        scale: 2,
        thousandsSeparator: '',  // any single char
        padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
        normalizeZeros: true,  // appends or removes zeros at ends
        radix: ',',  // fractional delimiter
        min: 0,
        max: 100000
    };

    ptBR = {
        firstDayOfWeek: 0,
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
        monthNames: [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
          'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar'
      };

    constructor(
        protected entryService: EntryService,
        protected categoryService: CategoryService,
        protected injector: Injector
    ) {
        super(injector, new Entry(), entryService, Entry.fromJson);
    }

    ngOnInit(): void {
        this.loadCategories();
        super.ngOnInit();
    }

    get typeOptions(): Array<any>{
        return Object.entries(Entry.types).map(
            ([value, text]) => {
                return {
                    text,
                    value
                };
                // return {
                //     text: text,
                //     value: value
                // }
            }
        );
    }

    private loadCategories(){
        this.categoryService.getAll().subscribe(
            categories => this.categories = categories
        );
    }

    protected creationPageTitle(): string{
        return 'Novo Lançamento';
    }

    protected editionPageTitle(): string{
        const resourceName = this.resource.name || '';
        return 'Editando Lançamento: ' + resourceName;
    }

    protected buildResourceForm(){
        /* resourceForm criado na classe pai */
        this.resourceForm = this.formBuilder.group({
            id: [ null ],
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(3)]],
            type: [ 'expense', [ Validators.required ]],
            amount: [ null, [ Validators.required ]],
            date: [ null, [ Validators.required ]],
            paid: [ true, [ Validators.required ]],
            categoryId: [ null, [ Validators.required ]],
        });
    }
}
