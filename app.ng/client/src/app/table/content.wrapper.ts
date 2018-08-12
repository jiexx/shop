import { Component, ComponentFactoryResolver } from '@angular/core';
import { BusService } from '../_service/bus.service';
import { DclWrapper } from '../_helper/dcl.wrapper';

@Component({
    selector: 'content-wrapper',
    template: `<div #target></div>`
})
export class ContentWrapper extends DclWrapper{

    constructor(public resolver: ComponentFactoryResolver,public busService: BusService) {
        super(resolver, busService);
    }
}