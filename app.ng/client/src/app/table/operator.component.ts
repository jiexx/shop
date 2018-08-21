import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Column } from './column';
import { md5 } from '../_helper/md5';
import { ImageComponent } from './image.component';

@Component({
    selector: 'operator',
    templateUrl: './operator.component.html',
    // styleUrls: ['../../assets/css/bs-datepicker.css']
})
export class OperatorComponent implements OnInit {
    @Input() cols: Array<Column>; 
    @Input() parent: any; 
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('dialog') dialog: ModalDirective;
    @ViewChild(ImageComponent) image: ImageComponent;

    _row = {};


    header: string = '';
    info: string = '';
    noinfobtn: boolean = true;
    _next: Function = null;
    _status: string = '';

    ngOnInit() {
    }

    _valid(_row) {
        var isvalid = true;
        for(var i in this.cols) {
            let col = this.cols[i];
            if(col && col.options) {
                if( col.options.password) {
                    _row[col.name] = md5(_row[col.name]);
                }else if(col.options.image){
                    _row[col.name] = {IMGS:this.image.get()};
                }
                if(col.options.valid) {
                    var valid = <Function>col.options.valid;
                    var result = valid.call(this, _row[col.name], col.alias);
                    if(result.no) {
                        isvalid = false;
                        this.showMessage(result.info);
                        break;
                    } 
                }
            }
        }
        return isvalid;
    };

    unselected(kvlist: any[], K:string){
        if(K==''||!K) return '';
        var kv = kvlist.find(kv => { return kv.id === K})
        return kv ? kv.text: '';
    }

    selected(kvlist: any[], colname:string,value:any){
        //var kv = kvlist.find(kv => { return kv.V === value});
        this._row[colname] = value.id ? value.id: '';;
    }
    
    add() {
        this._row = {};
        for(var i in this.cols){
            var title = this.cols[i].name;  
            this._row[title] = '';
        }
        this.header = '添加';
        this.modal.show();
        this._next = this.parent ? this.parent.onAdd : null;
        this._status = 'add';
    };
    delete(_row) {
        this._row = _row;
        this.info = '确定删除?';
        this.noinfobtn = true;
        this.dialog.show();
        this._next = this.parent ? this.parent.onDelete : null;
        this._status = 'del';
    }
    update(_row) {
        this.header = '修改';
        this._row = {};
        for(var i in this.cols){
            var title = this.cols[i].name;
            this._row[title] = _row[title];
        }
        this.modal.show();
        this._next = this.parent ? this.parent.onUpdate : null;
        this._status = 'upd';
    }
    confirm(){
        if(this._next) {
            if(this._status == 'del' || this._valid(this._row)){
                this._next.call(this.parent,this._row);
                this._next = null;
            }else {
                this.modal.hide();
                this._next = null;
                return;
            }
        }
        this.modal.hide();
        this.dialog.hide();
    }
    decline(){
        this.modal.hide();
        this.dialog.hide();
    }
    showMessage(info:string){
        this.info = info;
        this.noinfobtn = false;
        this.dialog.show();
    }
}