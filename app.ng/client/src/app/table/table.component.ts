import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Column } from './column';
import { DclComponent } from '../_helper/dcl.component';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: 'table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent implements OnInit, DclComponent {
    maxSize = 5;
    numPerPg = 20;
    total = 175;
    page = 1;

    url: string = '';
    model: any = [];
    cols: Array<Column>;
    row: Array<any>;
    loading = false;
    returnUrl: string;

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

    public onContainerClicked(row:any): void {
        this.row = row;
        if(this.visible)
            this.hide();
        else
            this.show();
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        protected ref: ChangeDetectorRef) { }

    ngOnInit() {

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // this.router.navigate(['Welcome']);
    }

    pageChanged(event: any): void {
        this.page = event.page;
        this.load();
    }

    load(d: any = null) {
        if(d) {
            this.cols = d.cols;
            this.url = d.url;
        }
        return this.http.get(this.url+'?version=2&pgidx='+(this.page-1)).pipe(map(res => res ));
    }
}
