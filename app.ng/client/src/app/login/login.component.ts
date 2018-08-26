import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: any;
    loading = false;
    returnUrl: string;

    constructor(
        //private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {}

    ngOnInit() {
        this.loginForm = {
            username: ['', Validators.required],
            password: ['', Validators.required]
        };

        // reset login status

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onLogin() {
        
        this.router.navigate(['/home']);
        localStorage.setItem('currentUser',' ');
        this.loading = true;

    }
}
