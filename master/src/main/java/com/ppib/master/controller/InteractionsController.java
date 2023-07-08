package com.ppib.master.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.ppib.master.domain.Protein;
import com.ppib.master.repository.ProteinRepository;


@Controller
public class InteractionsController {
	// TODO: query by Ensembl ID and Gene ID
	
	private final ProteinRepository repository;
        
    @Autowired
    public InteractionsController(ProteinRepository repository) {
    	this.repository = repository;
    }
        
    @QueryMapping
    public List<Protein> proteins() {
    	return repository.findAll();
    }
        
    @QueryMapping
    public Protein proteinById(String id) {
    	Optional<Protein> opt = repository.findById(id);
    	return opt.isEmpty() ? null : opt.get();
    }
        
    @QueryMapping
    public List<Protein> proteinsByIds(List<String> ids) {
    	return repository.findAllById(ids);
    }
    
}
