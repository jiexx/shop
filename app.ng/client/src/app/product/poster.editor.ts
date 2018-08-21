import { DatePipe } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { Column } from '../table/column';
import { EditorComponent } from '../editor/editor.component';
import { OperatorComponent } from '../table/operator.component';


export class PosterEditor extends EditorComponent{
    cols: Array<Column> = [
        new Column('ID',        'ID'      , false, 0 ),
        new Column('NO',        'ID'      , true, 0 ),
        new Column('USERID',    '用户名'   , true, 0 ),
        new Column('NAME',      '产品名'   , true, 1, {valid:Column.isnull}),
        new Column('PRICE',     '产品价格' , true, 6, {valid:Column.isnull}),
        new Column('EXP',       '过期时间' , true, 7, {valid:Column.isnull}),
        new Column('TITLE',     '海报标题' , true, 1, {valid:Column.isnull}),
        new Column('PERSONNUMREQ','活动人数', true, 1, {valid:Column.isnull}),
        new Column('STATE',     '产品状态' , true, 3,{valid:Column.isnull, select:[{id:'上架',text:'上架'},{id:'下架',text:'下架'}]} )
    ];
    product: any = null;
    row: any = null;
    ngAfterViewInit(){
        if(!this.product){
            this.op.add();
            this.ref.detectChanges();
        }
    };
    logChange($event: any, html: string) {
        var html = $event.html
            +'<p><b>注意事项:</b></p>'
            +'<p>在'+this.row['EXP']+'期间，发起人推荐分享的海报成单后，将收到一定数额的红包；</p>'
            +'<p>例如，小张通过微信/微博等社交媒体推荐给10位好友，有2个朋友觉得不错买单，那么小张将收到20块红包，</p>'
            +'<p>如果好友圈再推荐分享，成单了10笔，那么小张将收到50块红包。</p>'
        super.logChange($event, html);
        //console.log($event);
    }
    load(d: any): any {
        if(!d){
            return;
        }
        var that = this;
        this.http.get('http://localhost:8999/product/item/query/id?version=2&id=&no'+d).subscribe(result => {
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
        
        that.row['USERID'] = '0';
        that.row['PRODUCTID'] = that.product['ID'];
        var blob = new Blob(
            [this.html],
            {type : 'html'}
        ); 
        var a = new FileReader();
        a.onload = (e:any) => {
            console.log(e.target.result);
            that.row['FD'] = {HTML:e.target.result};
            var data = {newposter:that.row};
            that.http.post('http://localhost:8999/product/poster/add?version=2', data, that.httpOptions).subscribe(result => {
                var r: any = result;
                if (r && r.newposter.affectedRows == 1) {
                    that.op.showMessage('海报保存成功');
                }
            });
        };
        a.readAsDataURL(blob);
    };
    onAdd(row:any){
        if(!row) return;
        var that = this;
        var datePipe = new DatePipe('en-US');
        row['EXP'] = datePipe.transform(row['EXP'][0],'yyyy-MM-dd HH:mm:ss')+','+datePipe.transform(row['EXP'][1],'yyyy-MM-dd HH:mm:ss')
        row['USERID'] = 0;
        //row['PRICE'] = row['PRICE'].toString();
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