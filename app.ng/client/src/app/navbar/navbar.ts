import { ProductTable } from "../product/product.table";
import { KeeperTable } from "../keeper/keeper.table";
import { EditorComponent } from '../editor/editor.component';
import { PosterEditor } from "../product/poster.editor";

export class Navbar {
    public user;
    public menus;
    constructor() {
        this.user = {name:'',token:'',avatar:''};
        this.menus = [
            {
                name:'我的',
                child:[
                    {name: '产品列表', target:ProductTable},
                    {name: '客户列表', target:KeeperTable}
                ]
            },
            {
                name:'发布',
                child:[
                    {name: '模板预览', target:ProductTable},
                    {name: '在线编辑', target:PosterEditor},
                    {name: '渠道设置', target:KeeperTable}
                ]
            }
        ]
        
    }
}