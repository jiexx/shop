import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { BsDropdownModule,PaginationModule,ModalModule,BsDatepickerModule,CollapseModule } from 'ngx-bootstrap';
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
import { DialogComponent } from './_helper/dialog.component';
import { ImageComponent } from './_helper/image.component';
import { PosterEditor } from './product/poster.editor';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helper/auth.guard';
import { JwtInterceptor } from './_helper/jwt.interceptor';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { ProfileComponent } from './my/profile.component';
import { MySettings } from './my/my.settings';
import { OrderComponent } from './my/order.component';
import { MyWrapper } from './my/my.wrapper';
import { ShareComponent } from './my/share.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductTable,
    KeeperTable,
    PosterEditor,
    ContentWrapper,
    MyWrapper,
    OperatorComponent,
    ImageComponent,
    DialogComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    MySettings,
    OrderComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    routing,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    QuillModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    SelectModule
  ],
  entryComponents: [ 
    ProductTable,
    KeeperTable,
    PosterEditor,
    ProfileComponent,
    OrderComponent,
    ShareComponent,
    MySettings
  ],
  providers: [BusService,AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
