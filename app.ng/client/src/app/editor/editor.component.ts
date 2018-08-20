import { Component, ChangeDetectorRef, Input,AfterViewInit, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DclComponent } from '../_helper/dcl.component';
import { config } from '../../../../../config.js';
import { resolve, reject } from 'q';
import { Column } from '../table/column';
import { OperatorComponent } from '../table/operator.component';
import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;
const BlockEmbed = Quill.import('blots/block/embed');
class CustomEmbed extends BlockEmbed {
    static create(paramValue) {
        let node = super.create();
        node.innerHTML = paramValue;
        //node.setAttribute('contenteditable', 'false');
        //node.addEventListener('click', CustomEmbed.onClick);
        return node;
    }

    static value(node) {
        return node.innerHTML;
    }
}
/* CustomEmbed.onClick = function(){
    //do something
}*/
CustomEmbed.blotName = 'custom-embed';
CustomEmbed.className = 'custom-embed';
CustomEmbed.tagName = 'custom-embed';
Quill.register({
    'formats/custom-embed': CustomEmbed
});

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
    selectLocalImage(that: any) {
        var input = document.querySelector('input[type=file]') as HTMLInputElement;
        if(!input) {
            input = document.createElement("input");
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
        this._editorInstance.insertEmbed(range.index, "custom-embed", "<img src='"+url+"' class='img-fluid'>");
    }
    setFocus(editorInstance) {
        editorInstance.focus();
        let toolbar = editorInstance.getModule('toolbar');
        toolbar.addHandler('image', () => {
            this.selectLocalImage(this);
          });
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
                        resolve('http://localhost:9900/'+r.msg);
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