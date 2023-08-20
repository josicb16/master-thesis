package com.ppib.master.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import com.ppib.master.domain.Protein;
import com.ppib.master.repository.ProteinRepository;


@Controller
public class InteractionsController {
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
    public Protein proteinById(@Argument(name = "uniprotid") String uniprotid) {
    	Optional<Protein> opt = repository.findById(uniprotid);
    	return opt.isEmpty() ? null : opt.get();
    }
    
}
