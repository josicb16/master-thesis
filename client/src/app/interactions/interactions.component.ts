import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { DataPassingService } from '../data-passing/data-passing.service';

interface IFormData {
  proteinID: string;
}

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.css']
})
export class InteractionsComponent {
  public interactionsForm : FormGroup;
  loading: boolean | undefined;
  interactions: any;


  constructor(private apollo: Apollo, private datapassing: DataPassingService) {
    this.interactionsForm = new FormGroup({
      proteinID: new FormControl("", [Validators.required]),
    });
  }
  
  getInteractions(): void {

    const data : IFormData = this.interactionsForm.value as IFormData;

    const GET_INTERACTIONS = gql`
    query {
        proteinById (uniprotid : "${data.proteinID}") {
            uniprotid
            ensembl_ids
            gene_ids
            interacting_proteins1 {
              interactor {
                uniprotid
                ensembl_ids
                gene_ids
              }
              databases
              score
            }
            interacting_proteins2 {
              interactor {
                uniprotid
                ensembl_ids
                gene_ids
              }
              databases
              score
            }
          }
        }
    `

    console.log(data);

    this.apollo.query<any>({
      query: GET_INTERACTIONS,
    }).subscribe(({ data, error }: any) => {
      this.loading = error;
      this.interactions = data.proteinById;
      console.log(this.interactions);
      this.datapassing.pass(this.interactions);
    });
  }

}
