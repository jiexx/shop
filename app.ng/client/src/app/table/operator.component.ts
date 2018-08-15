import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Column } from './column';
import { SelectModule } from 'ng2-select';
import { md5 } from '../_helper/md5';

@Component({
    selector: 'operator',
    templateUrl: './operator.component.html'
})
export class OperatorComponent implements OnInit {
    @Input() cols: Array<Column>; 
    @Input() parent: any; 
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('dialog') dialog: ModalDirective;

    row = {};



    header: string = '';
    info: string = '';
    noinfobtn: boolean = true;
    _next: Function = null;

    ngOnInit() {
    }

    _valid(row) {
        var isvalid = true;
        for(var i in this.cols) {
            let col = this.cols[i];
            if(col && col.options) {
                if( col.options.password) {
                    row[col.name] = md5(row[col.name]);
                }
                if(col.options.valid) {
                    var valid = <Function>col.options.valid;
                    var result = valid.call(this, row[col.name], col.alias);
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
        this.row[colname] = value.id ? value.id: '';;
    }
    
    add() {
        this.row = {};
        for(var i in this.cols){
            var title = this.cols[i].name;  
            this.row[title] = '';
        }
        this.header = '添加';
        this.modal.show();
        this._next = this.parent ? this.parent.onAdd : null;
    };
    delete(row) {
        this.row = row;
        this.info = '确定删除?';
        this.noinfobtn = true;
        this.dialog.show();
        this._next = this.parent ? this.parent.onDelete : null;
    }
    update(row) {
        this.header = '修改';
        this.row = {};
        for(var i in this.cols){
            var title = this.cols[i].name;
            this.row[title] = row[title];
        }
        this.modal.show();
        this._next = this.parent ? this.parent.onUpdate : null;
    }
    confirm(){
        if(this._next) {
            if(this._valid(this.row)){
                this._next.call(this.parent,this.row);
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