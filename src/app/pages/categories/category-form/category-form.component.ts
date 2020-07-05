import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

    currentAction: string;
    categoryForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[];
    submittingForm = false;
    category: Category = new Category();

    constructor(
        private categoryService: CategoryService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.setCurrentAction();
        this.buildCategoryForm();
        this.loadCategory();
    }

    ngAfterContentChecked(){
        this.setPageTitle();
    }


    submitForm(){
        this.submittingForm = true;

        if (this.currentAction === 'new') {
            this.createCategory();
        } else {
            this.updateCategory();
        }

    }

    private setCurrentAction(){
        this.currentAction = this.route.snapshot.url[0].path === 'new' ? 'new' : 'edit';
    }

    private buildCategoryForm(){
        this.categoryForm = this.formBuilder.group({
            id: [ null ],
            name: [ null, [ Validators.required, Validators.minLength(2) ] ],
            description: [ null ]
        });
    }

    private loadCategory(){
        if (this.currentAction === 'edit'){
            // paramMap é um observable
            this.route.paramMap.pipe(
                switchMap(params => this.categoryService.getById( +params.get('id')) )
            ).subscribe(
                (category) => {
                    this.category = category;
                    this.categoryForm.patchValue(category); // bind data to form
                },
                (error) => alert('erro editar')
            );
        }
    }

    private setPageTitle(){
        if (this.currentAction === 'new'){
            this.pageTitle =  'Cadastro de Nova Categoria';
        } else {
            const categoryName = this.category.name || '';
            this.pageTitle  = `Editando Categoria: ${categoryName}`;
        }
    }

    private createCategory(){
        const newCategory: Category = Object.assign( new Category(), this.categoryForm.value);

        this.categoryService.create(newCategory)
            .subscribe(
                category => this.actionsFormSuccess(category),
                error =>  this.actionsFormError(error)
            );
    }

    private updateCategory(){
        const editCategory: Category = Object.assign( new Category(), this.categoryForm.value);

        this.categoryService.update(editCategory)
        .subscribe(
            category => this.actionsFormSuccess(category),
            error =>  this.actionsFormError(error)
        );
    }

    private actionsFormSuccess(category: Category){
        toastr.success('Sucesso cadastrar');

        // retorna uma promisse - redirect / reload component
        this.router.navigateByUrl('categories', { skipLocationChange: true })
            .then(
                () => this.router.navigate(['categories', category.id, 'edit'])
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
