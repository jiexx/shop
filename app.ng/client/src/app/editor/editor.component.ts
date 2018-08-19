import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DclComponent } from '../_helper/dcl.component';
import { config } from '../../../../../config.js';
import { resolve, reject } from 'q';
import { Column } from '../table/column';
import { OperatorComponent } from '../table/operator.component';

@Component({
    templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit,AfterViewInit, DclComponent  {
    protected @ViewChild(OperatorComponent) op: OperatorComponent;

  
    html:any = null;
    that:any = this;
    
    _editorInstance: any = null;
    httpOptions: any = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
        })
    };
    constructor(
        protected http: HttpClient,
        protected ref: ChangeDetectorRef,
        private elRef:ElementRef
        )
    {}
    ngOnInit() {
    }
    ngAfterViewInit(){
        
    }
    showImageUI() {
        var input = this.elRef.nativeElement.querySelector('input[type=file]');
        if(!input) {
            this.elRef.nativeElement.createElement("input");
            input.setAttribute("type", "file");
        }
        input.click();
        // Listen upload local image and save to server
        input.onchange = () => {
            const file = input.files[0];
            // file type is only image.
            if (/^image\//.test(file.type)) {
                var reader = new FileReader();
                reader.onloadend = (evt) =>{
                    this.saveToServer(evt.target.result)
                    .then(url =>{
                        this.insertToEditor(url);
                    });
                }
                reader.readAsDataURL(file);
                
            }
        };
    }
    insertToEditor(url) {
        // push image url to editor.
        const range = this._editorInstance.getSelection();
        this._editorInstance.insertEmbed(range.index, "image", url);
    }
    setFocus(editorInstance) {
        editorInstance.focus();
        let toolbar = editorInstance.getModule('toolbar');
        toolbar.addHandler('image', this.showImageUI);
        this._editorInstance = editorInstance;
    }
    logChange($event: any) {
        this.html = $event.html;
        //console.log($event);
    }
    saveToServer(base64){
        return new Promise((resolve, reject) =>{
            var data = {pic:base64.replace(/data:([A-Za-z-+\/]+);base64,/gi, "data:htmlimg;base64,")};
            this.http.post('http://localhost:9900/upload', data, this.httpOptions)
                .subscribe(result => {
                    var r: any = result;
                    if (r && r.code == 'OK') {
                        resolve(r.msg);
                    }else {
                        reject();
                    }
                });
        })
    }
    save(){

    }
    load(d: any = null) {
        
    }
}