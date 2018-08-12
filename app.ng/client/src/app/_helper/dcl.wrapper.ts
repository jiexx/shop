import { ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { BusService } from '../_service/bus.service';
import { DclWrapperMessage } from '../_service/dclwrapper.message';
import { DclComponent } from './dcl.component';

export class DclWrapper {
    @ViewChild('target', { read: ViewContainerRef }) target;
    cmpRef: ComponentRef<DclComponent>;
    private isViewInitialized: boolean = false;
    dclMessage: DclWrapperMessage;

    constructor(public resolver: ComponentFactoryResolver,public busService: BusService) {
        busService.receive(this,dclmsg => {
            this.dclMessage = <DclWrapperMessage>dclmsg;
            this.loadComponent();
        })
    }
    removeComponent(){
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
    }

    loadComponent() {
        if (!this.isViewInitialized || !this.dclMessage) {
            return;
        }
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
        var factory = this.resolver.resolveComponentFactory(this.dclMessage.component);
        this.cmpRef = this.target.createComponent(factory);
        (<DclComponent>this.cmpRef.instance).load(this.dclMessage.data);
    }

    ngOnChanges() {
        this.loadComponent();
    }

    ngAfterViewInit() {
        this.isViewInitialized = true;
        this.loadComponent();
    }

    ngOnDestroy() {
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
    }
}