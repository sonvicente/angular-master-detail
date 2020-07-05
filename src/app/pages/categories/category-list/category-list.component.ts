import { Component, OnInit } from '@angular/core';
import { error, element } from 'protractor';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

    categories: Category[] = [];

    constructor(
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.categoryService.getAll().subscribe(
            categories => this.categories = categories,
            error => alert('erro listar')
        );
    }

    deleteCategory(category: Category){

        const mustDelete = confirm('deletar?');

        if (mustDelete) {
            this.categoryService.delete(category.id).subscribe(
                () => this.categories = this.categories.filter( categoria => categoria !== category ),
                () => alert('erro delete')
            );
        }
    }

}
