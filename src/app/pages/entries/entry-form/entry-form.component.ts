import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

    categories: Array<Category>;

    currentAction: string;
    entryForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[];
    submittingForm = false;
    entry: Entry = new Entry();

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
        private entryService: EntryService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        protected categoryService: CategoryService,
    ) { }

    ngOnInit(): void {
        this.setCurrentAction();
        this.buildEntryForm();
        this.loadEntry();
        this.loadCategories();
    }

    ngAfterContentChecked(){
        this.setPageTitle();
    }


    submitForm(){
        this.submittingForm = true;

        if (this.currentAction === 'new') {
            this.createEntry();
        } else {
            this.updateEntry();
        }
    }

    get typeOptions(): Array<any>{
        return Object.entries(Entry.types).map(
          ([value, text]) => {
            return {
              text,
              value
                //   text: text,
                //   value: value
            };
          }
        );
      }

    private setCurrentAction(){
        this.currentAction = this.route.snapshot.url[0].path === 'new' ? 'new' : 'edit';
    }

    private buildEntryForm(){
        this.entryForm = this.formBuilder.group({
            id: [ null ],
            name: [ null, [ Validators.required, Validators.minLength(2) ] ],
            description: [ null ],
            type: [ 'expense', [ Validators.required ]],
            amount: [ null, [ Validators.required ]],
            date: [ null, [ Validators.required ]],
            paid: [ true, [ Validators.required ]],
            categoryId: [ null, [ Validators.required ]],
        });
    }

    private loadEntry(){
        if (this.currentAction === 'edit'){
            // paramMap é um observable
            this.route.paramMap.pipe(
                switchMap(params => this.entryService.getById( +params.get('id')) )
            ).subscribe(
                (entry) => {
                    this.entry = entry;
                    this.entryForm.patchValue(entry); // bind data to form
                },
                (error) => alert('erro editar')
            );
        }
    }

    private loadCategories(){
        this.categoryService.getAll().subscribe(
            categories => this.categories = categories
        );
    }

    private setPageTitle(){
        if (this.currentAction === 'new'){
            this.pageTitle =  'Cadastro de Novo Lançamento';
        } else {
            const entryName = this.entry.name || '';
            this.pageTitle  = `Editando Lançamento: ${entryName}`;
        }
    }

    private createEntry(){
        // const newEntry: Entry = Object.assign( new Entry(), this.entryForm.value);
        const newEntry: Entry = Entry.fromJson(this.entryForm.value);

        this.entryService.create(newEntry)
            .subscribe(
                entry => this.actionsFormSuccess(entry),
                error =>  this.actionsFormError(error)
            );
    }

    private updateEntry(){
        const editEntry: Entry = Entry.fromJson(this.entryForm.value);

        this.entryService.update(editEntry)
        .subscribe(
            entry => this.actionsFormSuccess(entry),
            error =>  this.actionsFormError(error)
        );
    }

    private actionsFormSuccess(entry: Entry){
        toastr.success('Sucesso cadastrar');

        // retorna uma promisse - redirect / reload component
        this.router.navigateByUrl('entries', { skipLocationChange: true })
            .then(
                () => this.router.navigate(['entries', entry.id, 'edit'])
            );
    }

    private actionsFormError(error){
        toastr.error('Erro cadastrar' + error);
        this.submittingForm = false;

        // 422 não conseguiu gravar
        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ['falha na comunucação com o servidor'];
        }
    }

}
