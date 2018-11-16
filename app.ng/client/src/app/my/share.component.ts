import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DclComponent } from '../_helper/dcl.component';

@Component({templateUrl: 'share.component.html'})
export class ShareComponent implements OnInit, AfterViewInit, DclComponent {
    maxSize = 5;
    numPerPg = 20;
    total = 175;
    page = 1;

    protected httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
    }

    constructor(
        private formBuilder: FormBuilder,
        protected http: HttpClient,
        private route: ActivatedRoute,
        private router: Router) {}

    ngOnInit() {

    }

    ngAfterViewInit(){
        this.http.get('http://localhost:8999/secret').subscribe(result =>{
            var r: any = result;
            if (r && r.code == 'OK') {
                localStorage.setItem('token',r.msg);
            }
        });
    }
    load(d: any = null) {
        
    }
}