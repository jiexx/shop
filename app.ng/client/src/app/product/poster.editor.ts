import { DatePipe } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { Column } from '../table/column';
import { EditorComponent } from '../editor/editor.component';
import { OperatorComponent } from '../table/operator.component';


export class PosterEditor extends EditorComponent{
    cols: Array<Column> = [
        new Column('ID',        'ID'      , false, 0 ),
        new Column('NO',        'ID'      , true, 0 ),
        new Column('KEEPERID',  '发布用户ID'   , true, 0 ),
        new Column('NAME',      '产品名'   , true, 1, {valid:Column.isnull}),
        new Column('PRICE',     '产品价格' , true, 6, {valid:Column.isnull}),
        new Column('EXP',       '过期时间' , true, 7, {valid:Column.isnull}),
        new Column('TITLE',     '海报标题' , true, 1, {valid:Column.isnull}),
        new Column('PERSONNUMREQ','活动人数', true, 1, {valid:Column.isnull}),
        new Column('STATE',     '产品状态' , true, 3,{valid:Column.isnull, select:[{id:'上架',text:'上架'},{id:'下架',text:'下架'}]} )
    ];
    tpl: any = null;
    posterid: string = null;
    row: any = null;
    
    ngAfterViewInit(){
        if(!this.row){
            this.op.add();
            this.ref.detectChanges();
        }
    };
    onChange($event: any) {
        if(this.tpl) {
            var html = this.tpl.replace(/<!-- HTML -->/g,$event.html)
            super.onChange({html:html});
        }
    }
    load(d: any): any {
        if(!this.row) return;
        var that = this;
        this.http.post('http://localhost:8999/template/poster', this.row, this.httpOptions).subscribe(result => {
            var r: any = result;
            if (r && r.code == 'OK') {
                that.tpl = r.data;
                that.onChange({html:''});
            }else {
                that.tpl = null;
            }
        });
    };
    save(){
        if (!this.srcdoc) {
            that.op.showMessage('海报还未编辑');
            return;
        }
        var that = this;
        var blob = new Blob(
            [this.srcdoc],
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
                    that.row['ID'] = r.newposter.FD.fileIds[0];
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
        row['KEEPERID'] = (<any>localStorage.getItem('user')).ID;
        //row['PRICE'] = row['PRICE'].toString();
        this.http.post('http://localhost:8999/product/item/add?version=2', row, this.httpOptions).subscribe(result => {
            var r: any = result;
            if (r && r.newitem.affectedRows == 1) {
                that.op.showMessage('产品添加成功');
                that.row = row;
                that.row['PRODUCTID'] = r.newitem['uuid'];
                that.load(r.newitem.insertId);
            }
        });
    }
    onUpdate(row:any){
    }
}