import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { InteractionsComponent } from './interactions/interactions.component';
import {ReactiveFormsModule } from '@angular/forms';
import { GraphVisualizationComponent } from './graph-visualization/graph-visualization.component';


@NgModule({
  declarations: [
    AppComponent,
    InteractionsComponent,
    GraphVisualizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
