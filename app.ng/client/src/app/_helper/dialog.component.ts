import { Component, OnInit, ViewChild } from '@angular/core';
import { BusService } from '../_service/bus.service';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
    selector: 'dialog-info',
    templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnInit {

    @ViewChild('dlg') dialog: ModalDirective;

    info: string = '';
    fnConfirm: Function = null;
    fnDecline: Function = null;

    constructor( private busService: BusService ) { 
        
    }
    ngOnInit() {
        this.busService.receive(this,msg => {
            this.info = msg.info;
            this.fnDecline = msg.fail;
            this.fnConfirm = msg.pass;
            this.dialog.show();
        })
    }

    confirm(){
        if(this.fnConfirm) this.fnConfirm();
        this.dialog.hide();
    }
    decline(){
        if(this.fnDecline) this.fnDecline();
        this.dialog.hide();
    }
}