import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../_helper/auth.guard';
import { BusService } from '../_service/bus.service';
import { AuthMessage } from '../_service/auth.message';
import { DomSanitizer } from '@angular/platform-browser';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit, AfterViewInit {
    loginForm: FormGroup;
    loading = false;
    returnUrl: string;
    captcha: any = '';
    fcase = 2;

    protected httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
    }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private busService: BusService,
        private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: [''/*, Validators.required*/],
            password: [''/*, Validators.required*/]
        });

        
        // reset login status

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returl'];
        
    }

    ngAfterViewInit(){
        if(this.returnUrl) {
            this.busService.send(new AuthMessage(this, AuthGuard, 'redirect', {returnUrl:this.returnUrl},
                result => {
                },
                error => {
                    this.fcase = error;
                }
            ));
        } 
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onRegister(){
        this.busService.send(new AuthMessage(this, AuthGuard, 'registe', {username:this.loginForm.controls.username.value},
            result => {
                this.captcha = this.sanitizer.bypassSecurityTrustUrl(result.msg);
                this.loading = false;
                this.fcase = 5; 
            },
            error => {
                this.loginForm.controls[error.data].setErrors(error.msg);
                this.loading = false;
            }
        ));
        this.loading = true;
    }

    onLogin() {
        this.busService.send(new AuthMessage(this, AuthGuard, 'login', {username:this.loginForm.controls.username.value,password:this.loginForm.controls.password.value},
            result => {
                this.loading = false;
                if(this.returnUrl) {
                    this.router.navigate([this.returnUrl]);
                }
            },
            error => {
                this.loginForm.controls[error.data].setErrors(error.msg);
                this.loading = false;
            }
        ));
        this.loading = true;
    }
    onCheckin(){
        this.busService.send(new AuthMessage(this, AuthGuard, 'checkin', {username:this.loginForm.controls.username.value},
            result => {
                this.loading = false;
                if(this.returnUrl) {
                    this.router.navigate([this.returnUrl]);
                }
            },
            error => {
                this.loginForm.controls[error.data].setErrors(error.msg);
                this.loading = false;
            }
        ));
        this.loading = true;
    }
}