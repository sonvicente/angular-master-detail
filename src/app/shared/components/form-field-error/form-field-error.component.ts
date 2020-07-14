import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

    @Input() control: FormControl;

    constructor() { }

    ngOnInit(): void {
    }

    get errorMessage(): string | null {
        if (this.mustShowErrorMessage()){
            return this.getErrorMesssage();
        } else {
            return null;
        }
    }

    private mustShowErrorMessage(): boolean {
        return this.control.invalid && this.control.touched;
    }

    private getErrorMesssage(): string | null {

        if (this.control.errors.required) {
            return 'Campo obrigatório';
        }

        if (this.control.errors.minlength) {
            const requiredLength = this.control.errors.minlength.requiredLength;
            return `Mínimo ${requiredLength} caracteres`;
        }

        if (this.control.errors.maxlenght) {
            const requiredLength = this.control.errors.maxlenght.requiredLenght;
            return `Máximo ${requiredLength} caracteres`;
        }

        if (this.control.errors.email) {
            return 'email inválido';
        }

        return null;
    }
}
