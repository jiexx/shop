import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'operator',
    templateUrl: './operator.component.html'
})
export class OperatorComponent {
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('dialog') dialog: ModalDirective;

    isAdd: boolean = true;
    isDel: boolean = true;
    isUpd: boolean = true;
    titles: Array<string> = [];
    row: Array<any> = [];

    constructor(add: boolean, del: boolean, upd: boolean, titles: Array<string>) {
        this.isAdd = add;
        this.isDel = del;
        this.isUpd = upd;
        this.titles = titles;
    }

    add() {
        this.modal.show();
    }
    onAdd(row:Array<any>) {

    }
}