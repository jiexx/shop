
import { ProfileComponent } from "./profile.component";
import { OrderComponent } from "./order.component";
import { ShareComponent } from "./share.component";

export class MyData {
    public menus = [ 
        {name:'我的订单', target:OrderComponent},
        {name:'个人资料',target:ProfileComponent},
        {name:'我的分享',target:ShareComponent}
    ];
    constructor() {
    }
}