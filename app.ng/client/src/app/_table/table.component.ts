import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BusService } from '../_services/bus';
import { Column } from './column';

@Component({
    templateUrl: 'table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent implements OnInit {
    @Input('data') meals: string[] = [];
    page: number = 1;

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
        private http: HttpClient,
        private busService: BusService) { }

    ngOnInit() {

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    load(url: string, cols: Array<Column>) {
        this.loading = true;
        this.cols = cols;
        this.http.get<any>(url+'&page='+(this.page-1)).subscribe(data => {
            this.loading = false;
            if (data instanceof Array && data.length > 0 && data[0]) {
                this.model = data;
            }
        });
    }
}
