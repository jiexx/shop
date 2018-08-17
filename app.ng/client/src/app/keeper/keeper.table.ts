import { TableComponent } from '../table/table.component';
import { Column } from '../table/column';



export class KeeperTable extends TableComponent{
    cols: Array<Column> = [
        new Column('ID',          'ID'      , false, 0 ),
        new Column('NO',          'ID'      , true, 0 ),
        new Column('AVATAR',      '头像'    , true, 5,{image:true,size:'_50x50'}),
        new Column('USERNAME',    '用户名'  , true, 1, {valid:Column.isnull}),
        new Column('USERPWD',     '密码'    , false, 2, {valid:Column.isnull, password:true}),
        new Column('EMPLOYEENAME','姓名'    , true, 1, {valid:Column.isnull}),
        new Column('DEPARTMENT',  '部门'    , true, 1 ),
        new Column('JOB',         '角色'  , false, 3, {valid:Column.isnull, select:null}),  //{KEY:,VALUE:}
        new Column('JOBDESC',     '角色'    , true, 0 ),
        new Column('EMAIL',       'EMAIL'   , true, 1 ),
        new Column('TEL',         '电话'    , true, 1, {valid:Column.isnphone }),
        new Column('STATUS',      '状态'    , true, 3, {valid:Column.isnull, select:[{id:'在职',text:'在职'},{id:'离职',text:'离职'}]}),
        new Column('SEX',         '性别'    , true, 3, {valid:Column.isnull, select:[{id:'男',text:'男'},{id:'女',text:'女'}]}),
        new Column('CREATTIME',   '创建时间', true, 0 ),
        new Column('UPDATETIME',  '最近更新', true, 0 ),
    ];
    _toList(kv) {
        var list = [];
        for(var i in kv) {
            list.push(kv[i].V);
        }
        return list;
    };
    load(d: any): any {
        var that = this;
        super.load({url:'http://localhost:8999/keeper/user/query?version=2',cols:this.cols}).subscribe(result => {
            var r: any = result;
            if (r && r.users) {
                that.model = r.users;
                let opts = that.cols.find(obj => { return obj.name === 'JOB'}).options;
                opts.select = r.jobs;
                that.loading = false;
                that.total = r.pg.total;
                that.ref.detectChanges();
            }
        });
    };
    onAdd(row:any){
        if(!row) return;
        var that = this;
        var data = {newuser:row}; //如要利用嵌套sql，row 结构必须与modal层级结构相同
        this.http.post('http://localhost:8999/keeper/user/add?version=2', data, this.httpOptions).subscribe(result => {
            var r: any = result;
            if (r && r.newuser.affectedRows == 1) {
                that.op.showMessage('添加成功');
                that.load(null);
            }
        });
    }
    onDelete(row:any){
        if(!row || !row.ID) return;
        var that = this;
        this.http.get('http://localhost:8999/keeper/user/delete?version=2&id='+row.ID).subscribe(result => {
            var r: any = result;
            if (r && r.deluser.affectedRows == 1) {
                that.op.showMessage('删除成功');
                that.load(null);
            }
        });
    }
    onUpdate(row:any){
        if(!row || !row.ID) return;
        var that = this;
        this.http.post('http://localhost:8999/keeper/user/update?version=2', row, this.httpOptions).subscribe(result => {
            var r: any = result;
            if (r && r.updateuser.affectedRows == 1) {
                that.op.showMessage('更新成功');
                that.load(null);
            }
        });
    }
}