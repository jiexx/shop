import { Message } from './message';
import { HttpClient } from '@angular/common/http';

export class DialogMessage extends Message {
    protected http: HttpClient;
    constructor(public from: any, public to: any, public info: string, public pass: Function = null, public fail: Function = null) {
        super(from, to);
    };
    public success(param:any){
        if(this.pass) this.pass.call(this.from, param);
    }
    public error(param:any){
        if(this.fail) this.fail.call(this.from, param);
    }
}