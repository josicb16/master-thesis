import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteractionsViewRoutingModule } from './interactions-view-routing.module';
import { InteractionsViewComponent } from './interactions-view.component';


@NgModule({
  declarations: [
    InteractionsViewComponent
  ],
  imports: [
    CommonModule,
    InteractionsViewRoutingModule
  ]
})
export class InteractionsViewModule { }
