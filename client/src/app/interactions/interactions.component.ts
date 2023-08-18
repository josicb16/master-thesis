import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { DataPassingService } from '../data-passing/data-passing.service';
import { GET_INTERACTIONS } from '../graphql/graphql.queries';


@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.css']
})
export class InteractionsComponent {
  public interactionsForm : FormGroup;
  loading: boolean | undefined;
  interactions: any;
  gotdata: boolean = false;


  constructor(private apollo: Apollo, private datapassing: DataPassingService) {
    this.interactionsForm = new FormGroup({
      proteinID: new FormControl("", [Validators.required]),
    });
  }
  
  getInteractions(): void {
    this.apollo.query<any>({
      query: GET_INTERACTIONS,
    }).subscribe(({ data, error }: any) => {
      this.loading = error;
      this.interactions = data.proteinById;
      console.log(this.interactions);
      this.datapassing.pass(this.interactions);
    });

    this.gotdata = true;
  }

}
