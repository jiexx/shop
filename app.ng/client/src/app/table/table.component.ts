import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Column } from './column';
import { DclComponent } from '../_helper/dcl.component';

@Component({
    templateUrl: 'table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent implements OnInit, DclComponent {
    maxSize = 5;
    total = 175;
    page = 1;

    model: any = {};
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
        private http: HttpClient) { }

    ngOnInit() {

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // this.router.navigate(['Welcome']);
    }

    load(d: any) {
        this.loading = true;
        this.cols = d.cols;
        
        this.http.get<any>(d.url+'&page='+(this.page-1)).subscribe(data => {
            this.loading = false;
            if (data instanceof Array && data.length > 0 && data[0]) {
                this.model = data;
            }
        });
    }
}
