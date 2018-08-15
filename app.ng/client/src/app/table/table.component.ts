import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Column } from './column';
import { DclComponent } from '../_helper/dcl.component';
import { map } from 'rxjs/operators';
import { OperatorComponent } from './operator.component';


@Component({
    templateUrl: 'table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent implements OnInit, DclComponent {
    @ViewChild(OperatorComponent) op: OperatorComponent;
    maxSize = 5;
    numPerPg = 20;
    total = 175;
    page = 1;

    url: string = '';
    model: any = [];
    cols: Array<Column>;
    titles: Array<any> = [];
    alias: Array<any> = [];
    loading = false;
    returnUrl: string;

    that = this;
    
    protected httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
    }

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
        private route: ActivatedRoute,
        private router: Router,
        protected http: HttpClient,
        protected ref: ChangeDetectorRef
        ) { }

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
        if (d) {
            this.cols = d.cols;
            this.url = d.url;
        }
        return this.http.get(this.url + '&pgidx=' + ((this.page - 1)*20)).pipe(map(res => res));
    }

}
