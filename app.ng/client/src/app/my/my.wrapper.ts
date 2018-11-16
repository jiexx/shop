import { Component, ComponentFactoryResolver } from '@angular/core';
import { BusService } from '../_service/bus.service';
import { DclWrapper } from '../_helper/dcl.wrapper';

@Component({
    selector: 'my-wrapper',
    template: `<div #target></div>`
})
export class MyWrapper extends DclWrapper{

    constructor(public resolver: ComponentFactoryResolver,public busService: BusService) {
        super(resolver, busService);
    }
}