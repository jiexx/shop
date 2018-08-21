import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { BsDropdownModule,PaginationModule,ModalModule,BsDatepickerModule   } from 'ngx-bootstrap';
import { QuillModule } from 'ngx-quill';
import { SelectModule } from 'ng2-select';
import { AppComponent } from './app.component';
import { routing }        from './app.routing';
import { BusService } from './_service/bus.service';
import { ProductTable } from './product/product.table';
import { KeeperTable } from './keeper/keeper.table';
import { ContentWrapper } from './table/Content.wrapper';
import { NavbarComponent } from './navbar/navbar.component';
import { OperatorComponent } from './table/operator.component';
import { ImageComponent } from './table/image.component';
import { PosterEditor } from './product/poster.editor';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductTable,
    KeeperTable,
    PosterEditor,
    ContentWrapper,
    OperatorComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PaginationModule.forRoot(),
    routing,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    QuillModule,
    BsDatepickerModule.forRoot(),
    SelectModule
  ],
  entryComponents: [ 
    ProductTable,
    KeeperTable,
    PosterEditor
  ],
  providers: [BusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
