import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';



export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[];
    submittingForm = false;

    protected route: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;

    constructor(
        protected injector: Injector,
        public resource: T, // passa uma instancia ex: new category()
        protected resourceService: BaseResourceService<T>, // passa o tipo T
        protected jsonDataToResourceFn: (jsonData: any) => T // recebe jsonData devolve objeto tipo T
    ) {
        this.route = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.formBuilder = injector.get(FormBuilder);
     }

    ngOnInit(): void {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked(){
        this.setPageTitle();
    }


    submitForm(){
        this.submittingForm = true;

        if (this.currentAction === 'new') {
            this.createResource();
        } else {
            this.updateResource();
        }

    }

    protected setCurrentAction(){
        this.currentAction = this.route.snapshot.url[0].path === 'new' ? 'new' : 'edit';
    }

    protected loadResource(){
        if (this.currentAction === 'edit'){
            // paramMap é um observable
            this.route.paramMap.pipe(
                switchMap(params => this.resourceService.getById( +params.get('id')) )
            ).subscribe(
                (resource) => {
                    this.resource = resource;
                    this.resourceForm.patchValue(resource); // bind data to form
                },
                (error) => alert('erro editar')
            );
        }
    }

    protected setPageTitle(){
        if (this.currentAction === 'new'){
            this.pageTitle =  this.creationPageTitle();
        } else {
            this.pageTitle  = this.editionPageTitle();
        }
    }

    protected creationPageTitle(): string{
        return 'Novo';
    }

    protected editionPageTitle(): string{
        return 'Edição';
    }

    protected createResource(){
        const newResource: T = this.jsonDataToResourceFn(this.resourceForm.value);

        this.resourceService.create(newResource)
            .subscribe(
                resource => this.actionsFormSuccess(resource),
                error =>  this.actionsFormError(error)
            );
    }

    protected updateResource(){
        const editResource: T = this.jsonDataToResourceFn(this.resourceForm.value);

        this.resourceService.update(editResource)
        .subscribe(
            resource => this.actionsFormSuccess(resource),
            error =>  this.actionsFormError(error)
        );
    }

    protected actionsFormSuccess(resource: T){
        toastr.success('Sucesso cadastrar');

        const baseComponentPath = this.route.snapshot.parent.url[0].path;

        // retorna uma promisse - redirect / reload component
        this.router.navigateByUrl( baseComponentPath, { skipLocationChange: true })
            .then(
                () => this.router.navigate([ baseComponentPath, resource.id, 'edit'])
            );
    }

    protected actionsFormError(error){
        toastr.error('Erro cadastrar' + error);
        this.submittingForm = false;

        // 422 não conseguiu gravar
        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ['falha na comunucação com o servidor'];
        }
    }

    // qdo fizer a herança obriga a criar o método na classe que herda
    // como se fosse uma interface
    protected abstract buildResourceForm(): void;
}
