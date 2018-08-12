import { Message } from './message';
import { Type } from '@angular/core';

export class DclWrapperMessage extends Message {
    constructor(public from: any, public to: any, public component: Type<any>, public data: any) {
        super(from, to);
    }
}