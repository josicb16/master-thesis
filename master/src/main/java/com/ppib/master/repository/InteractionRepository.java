package com.ppib.master.repository;

import org.springframework.graphql.data.GraphQlRepository;
import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.ppib.master.domain.Protein;


@GraphQlRepository
public interface InteractionRepository extends Neo4jRepository<Protein, String> {
	
}
