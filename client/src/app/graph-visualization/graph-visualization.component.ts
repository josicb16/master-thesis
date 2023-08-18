import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Network, DataSet, Node, Edge, IdType } from 'vis';

@Component({
  selector: 'app-graph-visualization',
  templateUrl: './graph-visualization.component.html',
  styleUrls: ['./graph-visualization.component.css']
})
export class GraphVisualizationComponent implements OnInit {

  constructor() { }

  /*
  ngOnInit(): void {
    const nodes = new DataSet([
      { id: 1, label: 'Node 11111111111111' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' },
    ]);

    const edges = new DataSet([
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 },
    ]);
    
  const container = document.getElementById('mynetwork')!;
    const data = {
      nodes: nodes,
      edges: edges,
    };
    const options = {};
    const network = new Network(container, data, options)
  }
  */

  ngOnInit(): void {
    this.drawNetwork();
  }

  drawNetwork(): void {
    const nodes = [
      { id: 1, value: 2, label: 'Algie' },
      { id: 2, value: 31, label: 'Alston' },
      { id: 3, value: 12, label: 'Barney' },
      { id: 4, value: 16, label: 'Coley' },
      { id: 5, value: 17, label: 'Grant' },
      { id: 6, value: 15, label: 'Langdon' },
      { id: 7, value: 6, label: 'Lee' },
      { id: 8, value: 5, label: 'Merlin' },
      { id: 9, value: 30, label: 'Mick' },
      { id: 10, value: 18, label: 'Tod' },
    ];

    const edges = [
      { from: 2, to: 8, value: 3, label: 'a', title: '0'},
      { from: 2, to: 9, value: 5, label: 'b', title: '1'},
      { from: 2, to: 10, value: 1, label: 'c', title: '2'},
      { from: 4, to: 6, value: 8, label: 'd', title: '3'},
      { from: 5, to: 7, value: 2, label: 'e', title: '4'},
      { from: 4, to: 5, value: 1, label: 'f', title: '5'},
      { from: 9, to: 10, value: 2, label: 'g', title: '6'},
      { from: 2, to: 3, value: 6, label: 'h', title: '7'},
      { from: 3, to: 9, value: 4, label: 'bojana', title: '8'},
      { from: 5, to: 3, value: 1, label: 'josic', title: '9'},
      { from: 2, to: 7, value: 4, label: 'meh', title: '10'},
    ];

    const container = document.getElementById('mynetwork')!;
    const data = {
      nodes: nodes,
      edges: edges,
    };
    const options = {
      nodes: {
        shape: 'dot',
        scaling: {
          customScalingFunction: (min: any, max: any, total: any, value: any) => {
            return value / total;
          },
          min: 5,
          max: 150,
        },
      },
      interaction: { hover: true },
      manipulation: {
        enabled: true,
      },
    };
    const network = new Network(container, data, options);

    network.on('click', function (params) {
      params.event = '[original event]';
      const t = document.getElementById('eventSpanHeading')!;
      t.innerText = JSON.stringify(params);
    });

    // Similarly, you can add other event handlers here...
  }
}