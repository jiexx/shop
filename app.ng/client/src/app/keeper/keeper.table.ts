import { TableComponent } from '../table/table.component';
import { Column } from '../table/column';


export class KeeperTable extends TableComponent{
    load(d: any): any {
        var cols = [
            new Column('ID',          'ID'      , true),
            new Column('USERNAME',    '用户名'  , true),
            new Column('USERPWD',     '密码'    , true),
            new Column('EMPLOYEENAME','姓名'    , true),
            new Column('DEPARTMENT',  '部门'    , true),
            new Column('JOB',         '角色'    , true),
            new Column('EMAIL',       'EMAIL'   , true),
            new Column('TEL',         '电话'    , true),
            new Column('STATUS',      '状态'    , true),
            new Column('SEX',         '性别'    , true),
            new Column('CREATTIME',   '创建时间', true),
            new Column('UPDATETIME',  '最近更新', true),
        ];
        var that = this;
        super.load({url:'http://localhost:8999/keeper/user/query',cols:cols}).subscribe(data => {
            that.loading = false;
            if (data instanceof Object && data.users) {
                that.model = data.users;
                that.loading = true;
                that.total = data.pg.total;
                that.ref.detectChanges();
            }
        });
    }
}