import { Component, ChangeDetectorRef, Input, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { config } from '../../../../../config.js';

@Component({
    selector: 'image-upload',
    templateUrl: './image.component.html'
})
export class ImageComponent implements OnInit {
    @Input() width: number = 1; 
    @Input() height: number = 1; 
    @Input() scaleWidth: number = 1; 
    @Input() scaleHeight: number = 1; 
    @Input() max: number = 1; 

    @Input() images: string[] = [];
    constructor(
        protected http: HttpClient,
        protected ref: ChangeDetectorRef
        ) { }
    ngOnInit() {
    }

    thumbnail(w1: number, h1: number, w2: number, h2: number){
        var minw = w1 > w2 ? (w1-w2)/2.0 : (w2-w1)/2.0;
        var minh = h1 > h2 ? (h1-h2)/2.0 : (h2-h1)/2.0;
        var w_sd1 = {srcX: minw, srcW: w2, dstX: 0,     dstW: w2};  //srcW > dstW
        //var w_sd2 = {srcX: 0,    srcW: w2, dstX: 0,     dstW: w2};  //srcW = dstW
        var w_sd3 = {srcX: 0,    srcW: w1, dstX: minw,  dstW: w1};  //srcW < dstW
        var h_sd1 = {srcY: minh, srcH: h2, dstY: 0,     dstH: h2};  //srcH > dstH
        //var h_sd2 = {srcY: 0,    srcH: h2, dstY: 0,     dstH: h2};  //srcH = dstH
        var h_sd3 = {srcY: 0,    srcH: h1, dstY: minh,  dstH: h1};  //srcH < dstH

        var w = w1 >= w2 ? w_sd1 : w_sd3;
        var h = h1 >= h2 ? h_sd1 : h_sd3;
        return Object.assign(w, h);
    }
    thumbnail2(w1: number, h1: number, w2: number, h2: number){
        var ow2 = w2, oh2 = h2;
        if( w1 > ow2 && h1 > oh2 ){
            h2 = w1 > h1 ? h1 : h1*ow2/w1;               
            w2 = w1 > h1 ? w1*oh2/h1 : w1;
        } 
        var minw = w1 > w2 ? (w1-w2)/2.0 : (w2-w1)/2.0;
        var minh = h1 > h2 ? (h1-h2)/2.0 : (h2-h1)/2.0;
        var w_sd1 = {srcX: minw, srcW: w2, dstX: 0,     dstW: w2};  //srcW > dstW
        //var w_sd2 = {srcX: 0,    srcW: w2, dstX: 0,     dstW: w2};  //srcW = dstW
        var w_sd3 = {srcX: 0,    srcW: w1, dstX: minw,  dstW: w1};  //srcW < dstW
        var h_sd1 = {srcY: minh, srcH: h2, dstY: 0,     dstH: h2};  //srcH > dstH
        //var h_sd2 = {srcY: 0,    srcH: h2, dstY: 0,     dstH: h2};  //srcH = dstH
        var h_sd3 = {srcY: 0,    srcH: h1, dstY: minh,  dstH: h1};  //srcH < dstH

        if( w1 > ow2 && h1 > oh2 ){
            w_sd1.dstW = ow2;
            h_sd1.dstH = oh2;
        } 
        var w = w1 >= w2 ? w_sd1 : w_sd3;
        var h = h1 >= h2 ? h_sd1 : h_sd3;
        return Object.assign(w, h);
    }

    onChange(files, canvas: HTMLCanvasElement){
        if (!files[0] || !files[0].type) return;
        var that = this;
        for(var i in files) {
          if (files[i] && files[i].type && files[i].type.indexOf('image') > -1) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
                var img = new Image();
                img.src = evt.target.result;
                var ctx = canvas.getContext("2d");
                ctx.fillStyle="#ffffff";
                canvas.width = that.scaleWidth;
                canvas.height = that.scaleHeight;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                img.onload = function() {
                    //var t = that.thumbnail(img.width, img.height, canvas.width, canvas.height);
                    var t = that.thumbnail2(img.width, img.height, canvas.width, canvas.height);
                    ctx.drawImage(img, t.srcX, t.srcY, t.srcW, t.srcH, t.dstX, t.dstY, t.dstW, t.dstH);
                    that.save(canvas.toDataURL("image/jpeg"));
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            reader.readAsDataURL(files[i]);
          }
        }
    }
    save(data:string){
        this.images.push(data);
        this.ref.detectChanges();
    }
    get(){
        return this.images;
    }
    onClick(index:number){
        this.images.splice(index,1);
    }
}