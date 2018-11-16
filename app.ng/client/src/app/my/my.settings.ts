import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef,Type } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DclComponent } from '../_helper/dcl.component';
import { BusService } from '../_service/bus.service';
import { DclWrapperMessage } from '../_service/dclwrapper.message'
import { OrderComponent } from './order.component'
import { MyData } from './my.data';
import { MyWrapper } from './my.wrapper';
import { AuthMessage } from '../_service/auth.message';
import { AuthGuard } from '../_helper/auth.guard';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageComponent } from '../_helper/image.component';
import { DialogMessage } from '../_service/dialog.message';
import { DialogComponent } from '../_helper/dialog.component';

@Component({
    templateUrl: './my.settings.html'
})

export class MySettings implements OnInit,AfterViewInit, DclComponent  {
    @ViewChild(ImageComponent) image: ImageComponent;
    my: MyData = new MyData();
    avatar: any[] = [];
    nick: string = ' ';
    color: string = 'dddddd';
    onFinish: Function = function(imgData){
        this.http.post('http://localhost:8999/user/changeavatar', {avatar:imgData}).subscribe(result => {
            var r: any = result;
            if (r && r.code == 'OK') {
                this.busService.send(new DialogMessage(this, DialogComponent, '头像修改成功'));
            }else {
                var j = 1;
            }
        });
    };

    httpOptions: any = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
        })
    };
    constructor(
        protected http: HttpClient,
        protected ref: ChangeDetectorRef,
        private elRef: ElementRef,
        private sanitizer: DomSanitizer,
        private busService: BusService
        )
    {
    }
    ngOnInit() {
        this.busService.send(new DclWrapperMessage(this,MyWrapper,OrderComponent,null));
        this.avatar = [AuthGuard.getUser().avatar];
        this.nick = AuthGuard.getUser().nick;
    }
    ngAfterViewInit(){
        
    }
    onLogout(){
        this.busService.send(new AuthMessage(this, AuthGuard, 'logout', {}));
    }
    onMenuClick(target: Type<any>) {
        this.busService.send(new DclWrapperMessage(this,MyWrapper,target,null));
    }
    load(d: any = null) {
        
    }
}