import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import { DataPassingService } from '../data-passing/data-passing.service';
import { InteractionsComponent } from '../interactions/interactions.component';
import { BetwenneessScoreService } from '../scores/betwenneess-score.service';
import { ClosenessScoreService } from '../scores/closeness-score.service';
import { PagerankServiceService } from '../scores/pagerank-service.service';
import { PassProteinIDService } from '../scores/pass-protein-id.service';
import { ProteinDegreeService } from '../scores/protein-degree.service';



@Component({
  selector: 'app-graph-visualization',
  templateUrl: './graph-visualization.component.html',
  styleUrls: ['./graph-visualization.component.css']
})
export class GraphVisualizationComponent {
  public degreeForm : FormGroup;
  public interactions : any | null;

  constructor(private datapassing: DataPassingService, private closenness: ClosenessScoreService, private idService: PassProteinIDService, private betwenneess: BetwenneessScoreService, private pagerankService : PagerankServiceService, private proteindegree : ProteinDegreeService) {
    this.degreeForm = new FormGroup({});
    this.datapassing.pass$.subscribe((interactions) => {
      this.interactions = interactions;
      this.drawNetwork();
    });
  }

  drawNetwork(): void {
    let nodes: any[] = [];
    let edges: any[] = [];

    var uniprotid_set = new Set<string>();
    var index_map = new Map<string, number>();
    var main_nodes = new Set<number>();
    var main_relationships : number[][] = [];
    
    let j = 0;
    for(let i=0; i<this.interactions.length; i++) {
      if(!uniprotid_set.has(this.interactions[i].uniprotid)) { // TRY: node id -> uniprotid
        main_nodes.add(j);
        uniprotid_set.add(this.interactions[i].uniprotid);
        nodes.push({id: j, value: 7, label: this.interactions[i].uniprotid, ensemblid: this.interactions[i].ensembl_ids.replaceAll("|", ", "), geneid: this.interactions[i].gene_ids.replaceAll("|", ", ")});
        index_map.set(this.interactions[i].uniprotid, j);
        j+=1;
      }
      else {
        main_nodes.add(index_map.get(this.interactions[i].uniprotid)!);
      }
      this.interactions[i].interacting_proteins1.forEach((element: { interactor: { uniprotid: any; ensembl_ids: any; gene_ids: any; }; score: any; databases: any; }) => {
        if(!uniprotid_set.has(element.interactor.uniprotid)) { 
          uniprotid_set.add(element.interactor.uniprotid);
          nodes.push({id: j, value: 7, label: element.interactor.uniprotid, ensemblid: element.interactor.ensembl_ids.replaceAll("|", ", "), geneid: element.interactor.gene_ids.replaceAll("|", ", ")});
          index_map.set(element.interactor.uniprotid, j);
          j+=1;
        }
      });
      this.interactions[i].interacting_proteins2.forEach((element: { interactor: { uniprotid: any; ensembl_ids: any; gene_ids: any; }; score: any; databases: any; }) => {
        if(!uniprotid_set.has(element.interactor.uniprotid)) { 
          uniprotid_set.add(element.interactor.uniprotid);
          nodes.push({id: j, value: 7, label: element.interactor.uniprotid, ensemblid: element.interactor.ensembl_ids.replaceAll("|", ", "), geneid: element.interactor.gene_ids.replaceAll("|", ", ")});
          index_map.set(element.interactor.uniprotid, j);
          j+=1;
        }
      });
    }

    for(let i=0; i<nodes.length; i++)
      main_relationships.push([]);

    var edge_i = 0;
    for(let i=0; i<this.interactions.length; i++) {
      var index1 = index_map.get(this.interactions[i].uniprotid)!;
      this.interactions[i].interacting_proteins1.forEach((element: { interactor: { uniprotid: any; ensembl_ids: any; gene_ids: any; }; score: any; databases: any; }) => {
        var index2 = index_map.get(element.interactor.uniprotid)!;
        if(main_nodes.has(index1) && main_nodes.has(index2) && !main_relationships[index1].includes(index2) && !main_relationships[index2].includes(index1)) {
          main_relationships[index1].push(index2);
          var db = this.formatDBString(element.databases);
          var c = 'red';
          if(element.score > 0.2)
            c = 'yellow';
          if(element.score > 0.6)
            c = 'blue';
          edges.push({id: edge_i, from: index1, to: index2, label: db, score: element.score, color: { color: c }});
          edge_i +=1;
        }
        if(!main_nodes.has(index1) || !main_nodes.has(index2)) {
          var db = this.formatDBString(element.databases);
          var c = 'red';
          if(element.score > 0.4)
            c = 'yellow';
          if(element.score > 0.6)
            c = 'blue';
          edges.push({id: edge_i, from: index1, to: index2, label: db, score: element.score, color: { color: c }});
          edge_i +=1;
        }
      });
      this.interactions[i].interacting_proteins2.forEach((element: { interactor: { uniprotid: any; ensembl_ids: any; gene_ids: any; }; score: any; databases: any; }) => {
        var index2 = index_map.get(element.interactor.uniprotid)!;
        if(main_nodes.has(index1) && main_nodes.has(index2) && !main_relationships[index1].includes(index2) && !main_relationships[index2].includes(index1)) {
          main_relationships[index1].push(index2);
          var db = this.formatDBString(element.databases);
          var c = 'red';
          if(element.score > 0.4)
            c = 'yellow';
          if(element.score > 0.6)
            c = 'blue';
          edges.push({id: edge_i, from: index1, to: index2, label: db, score: element.score, color: { color: c }});
          edge_i +=1;
        }
        if(!main_nodes.has(index1) || !main_nodes.has(index2)) {
          var db = this.formatDBString(element.databases);
          var c = 'red';
          if(element.score > 0.4)
            c = 'yellow';
          if(element.score > 0.6)
            c = 'blue';
          edges.push({id: edge_i, from: index1, to: index2, label: db, score: element.score, color: { color: c }});
          edge_i +=1;
        }
      });
    }

    console.log(main_relationships);
    
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

    network.on('doubleClick', (params) => {
      this.idService.pass(nodes[params.nodes[0]].label, 'newdata');
    })

    network.on('click',  (params) => {
      //params.event = '[original event]';
      const u = document.getElementById('uniprotid')!;
      const e = document.getElementById('ensemblid')!;
      const g = document.getElementById('geneid')!;
      const d = document.getElementById('nodedegree')!;
      const p = document.getElementById('pagerank')!;
      const c = document.getElementById('closeness')!;
      const b = document.getElementById('betweenness')!;

      d.innerText = "Degree: ";
      p.innerText = "PageRank: ";
      c.innerText = "Closeness centrality: ";
      b.innerText = "Betweenness centrality: ";

      if(params.nodes.length>0) {
        u.innerText = "UniProt ID: " + nodes[params.nodes[0]].label;
        e.innerText = "Ensembl Protein ID: " + nodes[params.nodes[0]].ensemblid;
        g.innerText = "Gene ID: " + nodes[params.nodes[0]].geneid;
        
        this.idService.pass(nodes[params.nodes[0]].label, 'scores');

        this.proteindegree.passscore$.subscribe((score) => {
          d.innerText = "Degree: " + score;
        })

        this.pagerankService.passscore$.subscribe((score) => {
          p.innerText = "PageRank: " + score;
        });

        this.closenness.passscore$.subscribe((score) => {
          c.innerText = "Closeness centrality: " + score;
        });

        this.betwenneess.passscore$.subscribe((score) => {
          b.innerText = "Betweenness centrality: " + score;
        });
      }
      else if(params.nodes.length===0 && params.edges.length>0) {
        u.innerText = "Source databases: " + edges[params.edges[0]].label;
        e.innerText = "Interaction score: " + edges[params.edges[0]].score;
        g.innerText = '';
        c.innerText = '';
        b.innerText = '';
        p.innerText = '';
        d.innerText = '';
      }
      else {
        u.innerText = '';
        e.innerText = '';
        g.innerText = '';
        c.innerText = '';
        b.innerText = '';
        p.innerText = '';
        d.innerText = '';
      }
    });
  }

  formatDBString(databases : string) : string {
    var db = '';
    if(databases.includes('s, t, r, i, n, g')) {
      if(db === '')
        db = db + 'STRING'
      else
        db = db + ', STRING'
    }
    if(databases.includes('b, i, o, g, r, i, d')) {
      if(db === '')
        db = db + 'BioGRID'
      else
        db = db + ', BioGRID'
    }
    if(databases.includes('i, n, t, a, c, t')) {
      if(db === '')
        db = db + 'IntAct'
      else
        db = db + ', IntAct'
    }
    if(databases.includes('h, i, p, p, i, e')) {
      if(db === '')
        db = db + 'HIPPIE'
      else
        db = db + ', HIPPIE'
    }
    if(databases.includes('r, e, a, c, t, o, m, e')) {
      if(db === '')
        db = db + 'Reactome'
      else
        db = db + ', Reactome'
    }
    return db;
  }

}