import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Message } from './message';

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

    getObservable(): Observable<any> {
        return this.subject.asObservable();
    }

    send(message: Message) {
        this.subject.next(message);
    }

    receive(that: any, callback) {
            if(that && that.busService) {
                return that.busService.getObservable().subscribe(message => {
                    if(message && message.to == that.constructor.name) {
                        callback(message);
                    }
                });
            }
    }
}