import { TableComponent } from "../table/table.component";

export class Navbar {
    public user;
    public menus;
    constructor() {
        this.user = {name:'',token:'',avatar:''};
        this.menus = [
            {name: '产品列表', target:TableComponent},
            {name: '客户列表', target:TableComponent}
        ];
    }
}