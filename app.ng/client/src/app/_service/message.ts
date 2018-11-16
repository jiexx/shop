import { Type } from "@angular/core";

export class Message {
    constructor(public from: any, public to: Type<any>) {}
}