package com.ppib.master.controller;

import java.util.List;
import java.util.Optional;

import org.jgrapht.alg.scoring.PageRank;
import org.jgrapht.Graph;
import org.jgrapht.graph.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import com.ppib.master.domain.IncomingInteraction;
import com.ppib.master.domain.OutgoingInteraction;
import com.ppib.master.domain.Protein;
import com.ppib.master.repository.ProteinRepository;


@Controller
public class InteractionsController {
	private final ProteinRepository repository;
	
	private final PageRank<String, DefaultEdge> pagerank;
        
    @Autowired
    public InteractionsController(ProteinRepository repository) {
    	this.repository = repository;
    	List<Protein> proteins = repository.findAll();
    	
    	Graph<String, DefaultEdge> graph = new DefaultUndirectedGraph<>(DefaultEdge.class);
    	
    	for(Protein protein : proteins) {
    		String node1 = protein.getUniProtID();
    		graph.addVertex(node1);
    		for(IncomingInteraction interaction : protein.getInteractingProteins1()) {
    			String node2 = interaction.getInteractor().getUniProtID();
    			graph.addVertex(node2);
    			graph.addEdge(node2, node1);
    		}
    		for(OutgoingInteraction interaction : protein.getInteractingProteins2()) {
    			String node2 = interaction.getInteractor().getUniProtID();
    			graph.addVertex(node2);
    			graph.addEdge(node1, node2);
    		}
    	}
    	
    	this.pagerank = new PageRank<String, DefaultEdge>(graph);
    }
    
    @QueryMapping
    public List<Protein> proteins() {
            return repository.findAll();
    }
    
    
    @QueryMapping
    public Protein proteinById(@Argument(name = "uniprotid") String uniprotid) {
    	Optional<Protein> opt = repository.findById(uniprotid);
    	return opt.isEmpty() ? null : opt.get();
    }
    
    @QueryMapping
    public float pageRankOfProtein(@Argument(name = "uniprotid") String uniprotid) {
    	return (float)((double)this.pagerank.getVertexScore(uniprotid));
    }
    
    
    
}
