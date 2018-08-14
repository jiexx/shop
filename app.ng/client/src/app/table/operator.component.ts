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

    constructor(add: boolean, del: boolean, upd: boolean) {
        this.isAdd = add;
        this.isDel = del;
        this.isUpd = upd;
    }

    add(row) {
        this.modalRef = this.modalService.show(template);
    }
}