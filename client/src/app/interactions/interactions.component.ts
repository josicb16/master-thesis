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
  public layers : string = "1";
  public threshold : number = 0.7;


  constructor(private apollo: Apollo, private datapassing: DataPassingService, private closenness: ClosenessScoreService, private idService : PassProteinIDService, private betwenneess: BetwenneessScoreService, private pagerankService : PagerankServiceService, private proteindegree : ProteinDegreeService) {
    this.interactionsForm = new FormGroup({
      proteinID: new FormControl("", [Validators.required]),
    });

    this.additionalForm = new FormGroup({
      layers_input : new FormControl("", []),
      threshold_input : new FormControl("", [])
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
    if(this.additionalForm.value.layers_input === "")
      this.layers = "1";
    else
      this.layers = this.additionalForm.value.layers_input;
    if(this.additionalForm.value.threshold_input === "")  
      this.threshold = 0;
    else 
      this.threshold = parseFloat(this.additionalForm.value.threshold_input);
    
    console.log(this.layers);
    console.log(this.threshold);
  }
  
  getInteractions(): void {
    if(this.additionalForm.value.layers_input === "")
      this.layers = "1";
    else
      this.layers = this.additionalForm.value.layers_input;
    if(this.additionalForm.value.threshold_input === "")  
      this.threshold = 0;
    else 
      this.threshold = parseFloat(this.additionalForm.value.threshold_input);


    

    console.log(this.layers);
    console.log(this.threshold);

    var data : IFormData = this.interactionsForm.value as IFormData;
    if(this.append) {
      this.append = false;
      data.proteinID = data.proteinID + " " + this.appendID;
    }

    var arg = this.formatProteinIDString(data.proteinID);
    console.log(arg);

    const GET_INTERACTIONS = gql`
    query {
      proteinsByIdsLayers(uniprotids : [${arg}], layers: "${this.layers}") {
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
      this.interactions = data.proteinsByIdsLayers;
      console.log(this.interactions)

      var arr_obj : any[] = [];      
      
      for(let j=0; j< this.interactions.length; j++) {
        var new_obj : any = {}
        new_obj.ensembl_ids = this.interactions[j].ensembl_ids,
        new_obj.gene_ids = this.interactions[j].gene_ids,
        new_obj.uniprotid = this.interactions[j].uniprotid

        // KREIRANJE NIZA INTERACTING PROTEINA
        var tmp_arr1 : any[] = [];
        for(let i=0; i<this.interactions[j].interacting_proteins1.length; i++) {
          if(this.interactions[j].interacting_proteins1[i].score>this.threshold)
            tmp_arr1.push(this.interactions[j].interacting_proteins1[i]);
        }
        new_obj.interacting_proteins1 = tmp_arr1;


        var tmp_arr2 : any[] = [];
        for(let i=0; i<this.interactions[j].interacting_proteins2.length; i++) {
          if(this.interactions[j].interacting_proteins2[i].score>this.threshold)
            tmp_arr2.push(this.interactions[j].interacting_proteins2[i]);
        }
        new_obj.interacting_proteins2 = tmp_arr2;

        if(tmp_arr1.length == 0 && tmp_arr2.length ==0)
          continue;

        arr_obj.push(new_obj);
    }

    console.log(arr_obj);
    console.log(this.interactions);

    this.datapassing.pass(arr_obj);
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
