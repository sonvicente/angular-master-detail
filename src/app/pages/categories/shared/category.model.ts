import { BaseResourceModel } from '../../../shared/models/base-resource.model';
export class Category extends BaseResourceModel {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string
    ){
        super(); // chama o construtor do BaseResourceModel
    }

    /* delega a criacao do objeto pro model */
    static fromJson(jsonData: any): Category{
        return Object.assign( new Category(), jsonData);
    }
}
