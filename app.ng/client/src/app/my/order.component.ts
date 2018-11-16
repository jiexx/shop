import { Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DclComponent } from '../_helper/dcl.component';

@Component({templateUrl: 'order.component.html'})
export class OrderComponent implements OnInit, AfterViewChecked, DclComponent {
    maxSize;
    numPerPg;
    total;
    page;

    protected httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
    }

    constructor(
        private formBuilder: FormBuilder,
        protected http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private ref: ChangeDetectorRef) {
            this.maxSize = 5;
            this.numPerPg = 20;
            this.total = 175;
            this.page = 1;
        }

    ngOnInit() {
    }

    ngAfterViewChecked(){
        this.maxSize = 5;
        this.numPerPg = 20;
        this.total = 175;
        this.page = 1;
    }
    load(d: any = null) {
        
    }
}