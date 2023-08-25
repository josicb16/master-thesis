import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { DataPassingService } from '../data-passing/data-passing.service';
import { BetwenneessScoreService } from '../scores/betwenneess-score.service';
import { ClosenessScoreService } from '../scores/closeness-score.service';
import { PagerankServiceService } from '../scores/pagerank-service.service';
import { PassProteinIDService } from '../scores/pass-protein-id.service';
import { ProteinDegreeService } from '../scores/protein-degree.service';

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
  public additionalForm : FormGroup;
  loading: boolean | undefined;
  interactions: any;
  append : boolean = false;
  appendID : string = "";
  public layers : number = 1;
  public threshold : string = 'high';


  constructor(private apollo: Apollo, private datapassing: DataPassingService, private closenness: ClosenessScoreService, private idService : PassProteinIDService, private betwenneess: BetwenneessScoreService, private pagerankService : PagerankServiceService, private proteindegree : ProteinDegreeService) {
    this.interactionsForm = new FormGroup({
      proteinID: new FormControl("", [Validators.required]),
    });

    this.additionalForm = new FormGroup({
      layers_input : new FormControl("", [Validators.required]),
      threshold_input : new FormControl("", [Validators.required])
    });

    this.idService.pass$.subscribe((data) => {
      if(data.method==='newdata') {
        this.append = true;
        this.appendID = data.ID;
        this.getInteractions();
      }
      else if(data.method==='scores') {
        this.getClosennessScore(data.ID);
        this.getBetweennessScore(data.ID);
        this.getPageRank(data.ID);
        this.getDegree(data.ID);
      }
    });
  }
  
  onAdditionalFormSubmit() : void {
    this.layers = this.additionalForm.value.layers_input;
    this.threshold = this.additionalForm.value.threshold_input;
  }
  
  getInteractions(): void {

    var data : IFormData = this.interactionsForm.value as IFormData;
    if(this.append) {
      this.append = false;
      data.proteinID = data.proteinID + " " + this.appendID;
    }

    var arg = this.formatProteinIDString(data.proteinID);
    console.log(arg);

    const GET_INTERACTIONS = gql`
    query {
      proteinsByIds (uniprotids : [${arg}]) {
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
    this.apollo.query<any>({
      query: GET_INTERACTIONS,
    }).subscribe(({ data, error }: any) => {
      this.loading = error;
      this.interactions = data.proteinsByIds;
      console.log(this.interactions);
      this.datapassing.pass(this.interactions);
    });
  }

  getClosennessScore(id: string) {
    const GET_CLOSENNESS_SCORE = gql`
    query {
      closenessCentralityOfProtein (uniprotid : "${id}")
    }
    `
    this.apollo.query<any>({
      query: GET_CLOSENNESS_SCORE,
    }).subscribe(({ data, error }: any) => {
      this.closenness.passscore(data.closenessCentralityOfProtein);
    });
  }

  getBetweennessScore(id: string) {
    const GET_BETWEENNESS_SCORE = gql`
    query {
      betweennessCentralityOfProtein (uniprotid : "${id}")
    }
    `
    this.apollo.query<any>({
      query: GET_BETWEENNESS_SCORE,
    }).subscribe(({ data, error }: any) => {
      this.betwenneess.passscore(data.betweennessCentralityOfProtein);
    });
  }

  getPageRank(id: string) {
    const GET_PAGERANK = gql`
    query {
      pageRankOfProtein (uniprotid : "${id}")
    }
    `
    this.apollo.query<any>({
      query: GET_PAGERANK,
    }).subscribe(({ data, error }: any) => {
      this.pagerankService.passscore(data.pageRankOfProtein);
    });
  }

  getDegree(id: string) {
    const GET_DEGREE = gql`
    query {
      degreeOfProtein (uniprotid : "${id}")
    }
    `
    this.apollo.query<any>({
      query: GET_DEGREE,
    }).subscribe(({ data, error }: any) => {
      this.proteindegree.passscore(data.degreeOfProtein);
    });
  }


  formatProteinIDString(id : string) : string {
    var ids_arr = id.split(" ");
    if(ids_arr.length==1)
      return '"' + id + '"';
    
      var ids_res = '"' + ids_arr[0] + '"'
      for(var i=1; i<ids_arr.length; i++) {
        ids_res += ',"' + ids_arr[i] + '"';
      }

      return ids_res;
  }

}
