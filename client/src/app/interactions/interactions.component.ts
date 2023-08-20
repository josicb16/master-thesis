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
  loading: boolean | undefined;
  interactions: any;

  public proteinid : string | null = null;


  constructor(private apollo: Apollo, private datapassing: DataPassingService, private closenness: ClosenessScoreService, private idService : PassProteinIDService, private betwenneess: BetwenneessScoreService, private pagerankService : PagerankServiceService, private proteindegree : ProteinDegreeService) {
    this.interactionsForm = new FormGroup({
      proteinID: new FormControl("", [Validators.required]),
    });

    this.idService.pass$.subscribe((id) => {
      this.proteinid = id;
      this.getClosennessScore();
      this.getBetweennessScore();
      this.getPageRank();
      this.getDegree();
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
    this.apollo.query<any>({
      query: GET_INTERACTIONS,
    }).subscribe(({ data, error }: any) => {
      this.loading = error;
      this.interactions = data.proteinById;
      console.log(this.interactions);
      this.datapassing.pass(this.interactions);
    });
  }

  getClosennessScore() {
    const GET_CLOSENNESS_SCORE = gql`
    query {
      closenessCentralityOfProtein (uniprotid : "${this.proteinid}")
    }
    `
    this.apollo.query<any>({
      query: GET_CLOSENNESS_SCORE,
    }).subscribe(({ data, error }: any) => {
      console.log(data.closenessCentralityOfProtein);
      this.closenness.passscore(data.closenessCentralityOfProtein);
    });
  }

  getBetweennessScore() {
    const GET_BETWEENNESS_SCORE = gql`
    query {
      betweennessCentralityOfProtein (uniprotid : "${this.proteinid}")
    }
    `
    this.apollo.query<any>({
      query: GET_BETWEENNESS_SCORE,
    }).subscribe(({ data, error }: any) => {
      console.log(data.betweennessCentralityOfProtein);
      this.betwenneess.passscore(data.betweennessCentralityOfProtein);
    });
  }

  getPageRank() {
    const GET_PAGERANK = gql`
    query {
      pageRankOfProtein (uniprotid : "${this.proteinid}")
    }
    `
    this.apollo.query<any>({
      query: GET_PAGERANK,
    }).subscribe(({ data, error }: any) => {
      console.log(data.pageRankOfProtein);
      this.pagerankService.passscore(data.pageRankOfProtein);
    });
  }

  getDegree() {
    const GET_DEGREE = gql`
    query {
      degreeOfProtein (uniprotid : "${this.proteinid}")
    }
    `
    this.apollo.query<any>({
      query: GET_DEGREE,
    }).subscribe(({ data, error }: any) => {
      console.log(data.degreeOfProtein);
      this.proteindegree.passscore(data.degreeOfProtein);
    });
  }

}
