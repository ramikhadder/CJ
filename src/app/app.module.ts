import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatIconModule, MatInputModule, MatMenuModule,
  MatSelectModule, MatSnackBarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppService} from './app.service';
import {HttpClientModule} from '@angular/common/http';
import { FormComponent } from './form/form.component';
import {Routing} from './app.routing';
import {AppAuthGuard} from './app.auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    Routing
  ],
  providers: [AppService, AppAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
