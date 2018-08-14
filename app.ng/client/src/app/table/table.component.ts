import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Column } from './column';
import { DclComponent } from '../_helper/dcl.component';
import { map } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

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

    modalRef: BsModalRef = null;
    dialogRef: BsModalRef = null;

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
        private http: HttpClient,
        protected ref: ChangeDetectorRef,
        private modalService: BsModalService) { }

    ngOnInit() {

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // this.router.navigate(['Welcome']);
    }

    pageChanged(event: any): void {
        this.page = event.page;
        this.load();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    confirm(): void {
        this.modalRef.hide();
    }

    decline(): void {
        this.modalRef.hide();
    }

    openDialog(template: TemplateRef<any>) {
        this.dialogRef = this.modalService.show(template);
    }
    dlgConfirm(): void {
        this.dialogRef.hide();
    }

    dlgDecline(): void {
        this.dialogRef.hide();
    }

    load(d: any = null) {
        if (d) {
            this.cols = d.cols;
            this.url = d.url;
            this.row = Array(d.cols.length).fill('');
        }
        return this.http.get(this.url + '?version=2&pgidx=' + (this.page - 1)).pipe(map(res => res));
    }

    wrench(template: TemplateRef<any>, row: any): void {
        this.modalRef = this.modalService.show(template);
        this.row = row;
    }

    remove(template: TemplateRef<any>, row: any): void {
        this.dialogRef = this.modalService.show(template);
        this.row = row;
    }

}
