import { ProductTable } from "../product/product.table";
import { KeeperTable } from "../keeper/keeper.table";

export class Navbar {
    public user;
    public menus;
    constructor() {
        this.user = {name:'',token:'',avatar:''};
        this.menus = [
            {name: '产品列表', target:ProductTable},
            {name: '客户列表', target:KeeperTable}
        ];
    }
}