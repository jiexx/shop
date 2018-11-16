import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BusService } from '../_service/bus.service';

@Injectable()
export class AuthGuard implements CanActivate {

    static setToken(t:string){
        localStorage.setItem('token',t);
        //this.setCookie('token', t, 10000);
    }
    static getToken(){
        return localStorage.getItem('token');
        //return this.getCookie('token');
    }
    static setUser(t:any, exp:number=10000){
        localStorage.setItem('user',JSON.stringify(t));
        //this.setCookie('user', encodeURIComponent(JSON.stringify(t)), exp);
    }
    static getUser(): any{
        return JSON.parse(localStorage.getItem('user'));
        //let u = decodeURIComponent(this.getCookie('user'));
        //if(u) return JSON.parse(u);
        //return null;
    }

    private static setCookie(name: string, value: string, expireDays: number, path: string = '') {
        let d:Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires:string = `expires=${d.toUTCString()}`;
        let cpath:string = path ? `; path=${path}` : '';
        document.cookie = `${name}=${value}; ${expires}${cpath}`;
    }
    private static getCookie(name: string):string {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }

    private static deleteCookie(name) {
        this.setCookie(name, '', -1);
    }

    constructor(private router: Router, private busService: BusService, private http: HttpClient) { 
        this.busService.receive(this,msg => {
            console.log(msg.command);
            if(msg.command == 'logout') {
                this.http.post('http://localhost:8999/auth/'+msg.command, {}).subscribe(result => {});
                AuthGuard.setUser('',-1);
                this.router.navigate(['/login']);
            }else if(msg.command == 'login' || msg.command == 'checkin'){
                this.http.post('http://localhost:8999/auth/'+msg.command, msg.data).subscribe(result => {
                    var r: any = result;
                    if (r && r.code == 'OK') {
                        AuthGuard.setUser(r.data);
                        this.router.navigate(['/home']);
                        msg.success(r);
                    }else {
                        msg.error(r);
                    }
                });
            }else if(msg.command == 'redirect'){
                console.log('redirect',JSON.stringify(msg.data));
                if(AuthGuard.getToken()){
                    if(AuthGuard.getUser()) {
                        this.router.navigate(msg.data.returnUrl); 
                        msg.success(msg.data.returnUrl);
                    }else {
                        msg.error(2);
                    }   
                }else {
                    msg.error(3);
                }
            }
        })
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (AuthGuard.getUser()) {
            // logged in so return true
            var requestUrl = route.queryParams['requesturl'];
            if(requestUrl) {
                if(AuthGuard.getToken()){
                    window.location.href = requestUrl+'/'+AuthGuard.getToken();
                }else {
                    this.router.navigate(['/login'], { queryParams: { requesturl: state.url }});
                }
            }
            return true;
        }
        console.log('AuthGuard.getToken()',AuthGuard.getToken());
        if (!AuthGuard.getToken()) {
            this.secret();
        }
        
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returl: state.url }});
        return true;
    }
    secret(){
        if(!AuthGuard.getToken()){
            this.http.post('http://localhost:8999/auth/secret',{}).subscribe(result =>{
                var r: any = result;
                if (r && r.code == 'OK') {
                    AuthGuard.setToken(r.msg);
                }
            });
        }
    }
}