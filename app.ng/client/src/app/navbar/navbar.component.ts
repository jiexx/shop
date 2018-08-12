import { ChangeDetectionStrategy, Component, Input, OnInit,Type } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BusService } from '../_service/bus.service';
import { Navbar } from './navbar';
import { DclWrapperMessage } from '../_service/dclwrapper.message'
import { ProductTable } from '../product/product.table'

@Component({
    selector: 'navbar-wrapper',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    @Input('data') meals: string[] = [];
    navbar: Navbar = new Navbar();
    login: any = {username:'',password:''};
    model: any = {};

    public visible = false;
    public visibleAnimate = false;

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true, 100);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }

    constructor(
        private busService: BusService) { }

    ngOnInit() {
        var i = 1;
        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onClick(target: Type<any>) {
        this.busService.send(new DclWrapperMessage(this,'ContentWrapper',ProductTable,null));
    }
}
