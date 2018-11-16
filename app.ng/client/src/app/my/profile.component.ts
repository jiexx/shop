import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DclComponent } from '../_helper/dcl.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusService } from '../_service/bus.service';
import { DialogMessage } from '../_service/dialog.message';
import { DialogComponent } from '../_helper/dialog.component';

@Component({
    templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit,AfterViewInit, DclComponent  {
    //@ViewChild(OperatorComponent) op: OperatorComponent;
    profileForm: FormGroup = this.formBuilder.group({
        mobile1: [''],
        mobile2: [''],
        balance: [''],
        mobile: [''],
        createtime: [''],
        nick: [''],
        job: [''],
        email: [''],
        address: ['']
    });


    httpOptions: any = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
        })
    };
    constructor(
        protected http: HttpClient,
        protected ref: ChangeDetectorRef,
        private busService: BusService,
        private formBuilder: FormBuilder,
        )
    {
    }
    get f() { return this.profileForm.controls; }

    ngOnInit() {
        this.http.post('http://localhost:8999/user/profile', {}).subscribe(result => {
            var r: any = result;
            if (r && r.code == 'OK') {
                this.f.mobile.setValue(r.data.TEL);
                this.f.balance.setValue(r.data.BALANCE);
                this.f.createtime.setValue(r.data.CREATETIME);
                this.f.nick.setValue(r.data.NICKNAME);
                this.f.job.setValue(r.data.JOB);
                this.f.email.setValue(r.data.EMAIL);
                this.f.address.setValue(r.data.ADDRESS);
            }else {
                var j = 1;
            }
        });
    }
    ngAfterViewInit(){
        
    }
    onMobileChange(){
        var that = this;
        this.http.post('http://localhost:8999/user/changemobile', {mobile1:this.f.mobile1.value,mobile2:this.f.mobile2.value}).subscribe(result => {
            var r: any = result;
            if (r && r.code == 'OK') {
                that.busService.send(new DialogMessage(that, DialogComponent, '登录账号修改成功'));
            }else {
                that.f[r.data].setErrors(r.msg);
            }
        });
    }
    onProfileChange(){
        this.http.post('http://localhost:8999/user/changeprofile', this.profileForm.getRawValue()).subscribe(result => {
            var r: any = result;
            if (r && r.code == 'OK') {
            }else {
                var j = 1;
            }
        });
    }
    load(d: any = null) {
        
    }
}