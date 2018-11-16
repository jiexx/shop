import { Component, OnInit, ViewChild } from '@angular/core';
import { BusService } from '../_service/bus.service';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
    selector: 'table-info',
    templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {

    indMaxSize: number = 5;
    indNumPerPg: number = 20;
    indTotal: number = 175;
    indCurrPage: number = 1;

    url: string = '';

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