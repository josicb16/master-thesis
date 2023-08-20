import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import { DataPassingService } from '../data-passing/data-passing.service';



@Component({
  selector: 'app-graph-visualization',
  templateUrl: './graph-visualization.component.html',
  styleUrls: ['./graph-visualization.component.css']
})
export class GraphVisualizationComponent {
  public degreeForm : FormGroup;
  public interactions : any | null;
  public numberOfNodes : number = 10; // IZMENITI POSLE

  constructor(private datapassing: DataPassingService) {
    this.degreeForm = new FormGroup({});
    this.datapassing.pass$.subscribe((interactions) => {
      this.interactions = interactions; 
      this.drawNetwork();
    });
  }

  drawNetwork(): void {
    let nodes: any[] = [{id: 0, value: 7, label: this.interactions.uniprotid, ensemblid: this.interactions.ensembl_ids.replaceAll("|", ", "), geneid: this.interactions.gene_ids.replaceAll("|", ", ")}];
    let edges: any[] = [];

    let nodeNeighbors: number[][] = [];
    for (let i = 0; i < this.numberOfNodes; i++) {
      nodeNeighbors[i] = [];  
    }
    
    let i = 1;
    let edge_i = 0;
    this.interactions.interacting_proteins1.forEach((element: { interactor: { uniprotid: any; ensembl_ids: any; gene_ids: any; }; score: any; databases: any; }) => {
      var db = '';
      if(element.databases.includes('s, t, r, i, n, g')) {
        if(db === '')
          db = db + 'STRING'
        else
          db = db + ', STRING'
      }
      if(element.databases.includes('b, i, o, g, r, i, d')) {
        if(db === '')
          db = db + 'BioGRID'
        else
          db = db + ', BioGRID'
      }
      if(element.databases.includes('i, n, t, a, c, t')) {
        if(db === '')
          db = db + 'IntAct'
        else
          db = db + ', IntAct'
      }
      if(element.databases.includes('h, i, p, p, i, e')) {
        if(db === '')
          db = db + 'HIPPIE'
        else
          db = db + ', HIPPIE'
      }
      if(element.databases.includes('r, e, a, c, t, o, m, e')) {
        if(db === '')
          db = db + 'Reactome'
        else
          db = db + ', Reactome'
      }


      if(this.interactions.uniprotid !== element.interactor.uniprotid) {
        nodes.push({id: i, value: 7, label: element.interactor.uniprotid, ensemblid: element.interactor.ensembl_ids.replaceAll("|", ", "), geneid: element.interactor.gene_ids.replaceAll("|", ", ")});
        edges.push({id: edge_i, from: 0, to: i, label: db, score: element.score});
        nodeNeighbors[0].push(i);
        nodeNeighbors[i].push(0);
        i +=1;
        edge_i +=1;
      }
      else {
        edges.push({id: edge_i, from: 0, to: 0, label: db, score: element.score});
        nodeNeighbors[0].push(0);
        edge_i +=1;
      }
    });
    
    this.interactions.interacting_proteins2.forEach((element: { interactor: { uniprotid: any; ensembl_ids: any; gene_ids: any; }; score: any; databases: any; }) => {
      var db = '';
      if(element.databases.includes('s, t, r, i, n, g')) {
        if(db === '')
          db = db + 'STRING'
        else
          db = db + ', STRING'
      }
      if(element.databases.includes('b, i, o, g, r, i, d')) {
        if(db === '')
          db = db + 'BioGRID'
        else
          db = db + ', BioGRID'
      }
      if(element.databases.includes('i, n, t, a, c, t')) {
        if(db === '')
          db = db + 'IntAct'
        else
          db = db + ', IntAct'
      }
      if(element.databases.includes('h, i, p, p, i, e')) {
        if(db === '')
          db = db + 'HIPPIE'
        else
          db = db + ', HIPPIE'
      }
      if(element.databases.includes('r, e, a, c, t, o, m, e')) {
        if(db === '')
          db = db + 'Reactome'
        else
          db = db + ', Reactome'
      }

      if(this.interactions.uniprotid !== element.interactor.uniprotid) {
        nodeNeighbors[0].push(i);
        nodeNeighbors[i].push(0);
        nodes.push({id: i, value: 7, label: element.interactor.uniprotid, ensemblid: element.interactor.ensembl_ids.replaceAll("|", ", "), geneid: element.interactor.gene_ids.replaceAll("|", ", ")});
        edges.push({id: edge_i, from: 0, to: i, label: db, score: element.score});
        i +=1;
        edge_i +=1;
      }
      else {
        edges.push({id: edge_i, from: 0, to: 0, label: db, score: element.score});
        nodeNeighbors[0].push(0);
        edge_i +=1;
      }
    });

    const container = document.getElementById('mynetwork')!;
    const data = {
      nodes: nodes,
      edges: edges,
    };
    const options = {
      nodes: {
        shape: 'dot',
      },
      interaction: { hover: true },
      manipulation: {
        enabled: true,
      },
    };
    const network = new Network(container, data, options);

    network.on('click',  (params) => {
      params.event = '[original event]';
      const u = document.getElementById('uniprotid')!;
      const e = document.getElementById('ensemblid')!;
      const g = document.getElementById('geneid')!;
      const d = document.getElementById('nodedegree')!;
      const p = document.getElementById('pagerank')!;
      if(params.nodes.length>0) {
        u.innerText = "UniProt ID: " + nodes[params.nodes[0]].label;
        e.innerText = "Ensembl Protein ID: " + nodes[params.nodes[0]].ensemblid;
        g.innerText = "Gene ID: " + nodes[params.nodes[0]].geneid;
        d.innerText = "Stepen cvora " + nodes[params.nodes[0]].label;

        const neighborsSet: Set<number> = new Set(nodeNeighbors[params.nodes[0]]);
        let deg = neighborsSet.size;
        d.innerText = "Stepen cvora: " + deg;
      }
      else {
        u.innerText = "Source databases: " + edges[params.edges[0]].label;
        e.innerText = "Interaction score: " + edges[params.edges[0]].score;
        g.innerText = '';
      }



    });
  }

}