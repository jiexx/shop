import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BusService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    send(message: any) {
        this.subject.next(message);
    }

    receive(that: any) {
        return new Promise((resolve, reject) => {
            this.subject.asObservable().subscribe(message => {
                if(message.to == that.constructor.name) {
                    resolve(message);
                }else{
                    reject();
                }
            });
        });
    }
}