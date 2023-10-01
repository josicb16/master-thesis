package com.ppib.master.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

import org.jgrapht.alg.scoring.BetweennessCentrality;
import org.jgrapht.alg.scoring.ClosenessCentrality;
import org.jgrapht.alg.scoring.PageRank;
import org.jgrapht.Graph;
import org.jgrapht.graph.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
	private final BetweennessCentrality<String, DefaultEdge> betweenness;
	private final ClosenessCentrality<String, DefaultEdge> closeness;
	
        
    @Autowired
    public InteractionsController(ProteinRepository repository) {
    	this.repository = repository;
    	
    	List<Protein> proteins = repository.findAll();
    	
    	Graph<String, DefaultEdge> graph = new DefaultDirectedGraph<>(DefaultEdge.class);
    	
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
    	this.betweenness = new BetweennessCentrality<String, DefaultEdge>(graph);
    	this.closeness = new ClosenessCentrality<String, DefaultEdge>(graph);
    	
    }
    
    
    @QueryMapping
    public List<Protein> proteins() {
    	return repository.findAll();
    }
    
    @QueryMapping
    public Page<Protein> proteins2(@Argument(name = "page") int page, @Argument(name = "size") int size) {
    	PageRequest pr = PageRequest.of(page, size);
    	return repository.findAll(pr);
    }
    
    
    @QueryMapping
    public List<Protein> proteinsByIds(@Argument(name = "uniprotids") List<String> uniprotids) {
        List<Protein> res = new ArrayList<>();    
    	for(String uniprotid: uniprotids) {
    		Optional<Protein> opt = repository.findById(uniprotid);
    		if(opt.isPresent())
    			res.add(opt.get());
            }
    	return res;
    }
    
    @QueryMapping
    public List<Protein> proteinsByIdsLayers(@Argument(name = "uniprotids") List<String> uniprotids, @Argument(name = "layers") String layers) {
        List<Protein> res = new ArrayList<>();   
        Map<String, Boolean> found = new TreeMap<String, Boolean>();
        
        for(String uniprotid : uniprotids) {
        	found.put(uniprotid, false);
        }
        
        int layers_i = Integer.parseInt(layers);
    	
        for(int i=0; i<layers_i; i++) {
    		for(String uniprotid: uniprotids) {
    			Optional<Protein> opt = repository.findById(uniprotid);
    			if(opt.isPresent()) {
    				if(found.get(uniprotid) == false) {
    					found.put(uniprotid, true);
    					res.add(opt.get());
    				}
    			}
            }
    		
    		for(Protein p : res) {
    			for(IncomingInteraction interaction : p.getInteractingProteins1()) {
    				String name = interaction.getInteractor().getUniProtID();
    				if(!uniprotids.contains(name)) {
    					uniprotids.add(name);
    					found.put(name, false);
    				}
    			}
    			
    			for(OutgoingInteraction interaction : p.getInteractingProteins2()) {
    				String name = interaction.getInteractor().getUniProtID();
    				if(!uniprotids.contains(name)) {
    					uniprotids.add(name);
    					found.put(name, false);
    				}
    			}
    		}
    	}
    	
    	
    	return res;
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
    
    @QueryMapping
    public float betweennessCentralityOfProtein(@Argument(name = "uniprotid") String uniprotid) {
    	return (float)((double)this.betweenness.getVertexScore(uniprotid));
    }
    
    @QueryMapping
    public float closenessCentralityOfProtein(@Argument(name = "uniprotid") String uniprotid) {
    	return (float)((double)this.closeness.getVertexScore(uniprotid));
    }
    
    
    @QueryMapping
    public int degreeOfProtein(@Argument(name = "uniprotid") String uniprotid) {
    	Optional<Protein> opt = repository.findById(uniprotid);
    	if(opt.isPresent()) {
    		Set<String> proteinids = new TreeSet<>();
    		for(IncomingInteraction p : opt.get().getInteractingProteins1()) {
    			proteinids.add(p.getInteractor().getUniProtID());
    		}
    		for(OutgoingInteraction p : opt.get().getInteractingProteins2()) {
    			proteinids.add(p.getInteractor().getUniProtID());
    		}
    		return proteinids.size();
    	}
    	return 0;
    }
    
    
        
}

