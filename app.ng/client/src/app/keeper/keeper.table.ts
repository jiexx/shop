import { TableComponent } from '../table/table.component';
import { Column } from '../table/column';


export class KeeperTable extends TableComponent{
    load(d: any): any {
        var cols = [
            new Column('ID'      , true),
            new Column('用户名'  , true),
            new Column('密码'    , true),
            new Column('姓名'    , true),
            new Column('部门'    , true),
            new Column('角色'    , true),
            new Column('EMAIL'   , true),
            new Column('电话'    , true),
            new Column('状态'    , true),
            new Column('性别'    , true),
            new Column('创建时间', true),
            new Column('最近更新', true),
        ];
        var that = this;
        super.load({url:'http://localhost:8999/keeper/user/query',cols:cols}).subscribe(data => {
            that.loading = false;
            if (data instanceof Object && data.jobs) {
                that.model = data.jobs;
                that.loading = true;
            }
        });
    }
}