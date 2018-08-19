import { TableComponent } from '../table/table.component';
import { Column } from '../table/column';
import { EditorComponent } from '../editor/editor.component';
import { OperatorComponent } from '../table/operator.component';


export class PosterEditor extends EditorComponent{
    cols: Array<Column> = [
        new Column('ID',        'ID'      , false, 0 ),
        new Column('NO',        'ID'      , true, 0 ),
        new Column('USERID',    '用户名'  , true, 0, {valid:Column.isnull}),
        new Column('NAME',      '产品名'   , true, 1, {valid:Column.isnull}),
        new Column('PRICE',     '产品价格' , true, 1, {valid:Column.isnull}),
        new Column('STATE',     '产品状态' , true, 3,{valid:Column.isnull, select:[{id:'上架',text:'上架'},{id:'下架',text:'下架'}]} ),
        new Column('TITLE',     '海报标题' , true, 1, {valid:Column.isnull}),
        new Column('PERSONNUMREQ','活动人数', true, 1, {valid:Column.isnull}),
        new Column('EXP',       '过期时间' , true, 1, {valid:Column.isnull})
    ];
    product: any = null;
    row: any = null;
    ngAfterViewInit(){
        if(!this.product){
            this.op.add();
            this.ref.detectChanges();
        }
    };
    load(d: any): any {
        if(!d){
            return;
        }
        var that = this;
        this.http.get('http://localhost:8999/product/item/query?version=2&id=&no'+d).subscribe(result => {
            var r: any = result;
            if (r && r.item) {
                that.product = r.item;
                that.ref.detectChanges();
            }
        });
    };
    save(){
        if (!this.html) {
            that.op.showMessage('海报还未编辑');
            return;
        }
        var that = this;
        that.row['FD'] = 'data:html;base64,'+btoa(this.html);
        that.row['USERID'] = 0;
        that.row['PRODUCTID'] = that.product['ID'];
        this.http.post('http://localhost:8999/product/poster/add?version=2', that.product, this.httpOptions).subscribe(result => {
            var r: any = result;
            if (r && r.newposter.affectedRows == 1) {
                that.op.showMessage('海报保存成功');
            }
        });
    };
    onAdd(row:any){
        if(!row) return;
        var that = this;
        this.http.post('http://localhost:8999/product/item/add?version=2', row, this.httpOptions).subscribe(result => {
            var r: any = result;
            if (r && r.newitem.affectedRows == 1) {
                that.op.showMessage('产品添加成功');
                that.row = row;
                that.load(r.newitem.insertId);
            }
        });
    }
    onUpdate(row:any){
    }
}