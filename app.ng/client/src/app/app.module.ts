import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { BsDropdownModule,PaginationModule,ModalModule  } from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { routing }        from './app.routing';
import { BusService } from './_service/bus.service';
import { ProductTable } from './product/product.table';
import { KeeperTable } from './keeper/keeper.table';
import { ContentWrapper } from './table/Content.wrapper';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductTable,
    KeeperTable,
    ContentWrapper
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PaginationModule.forRoot(),
    routing,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  entryComponents: [ 
    ProductTable,
    KeeperTable
  ],
  providers: [BusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
