package com.ppib.master.domain;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
public class OutgoingInteraction {
	// TODO: IncomingInteraction and OutgoingInteraction classes to inherit from one base class.
	
	@Id @GeneratedValue
	private Long id;
		
	private final String scores;
		
	private final String databases;
		
	@TargetNode
	private final Protein interactor;
		
	public OutgoingInteraction(String scores, String databases, Protein interactor) {
		this.scores = scores;
		this.databases = databases;
		this.interactor = interactor;
	}
	
	public Protein getTargetProtein() {
		return interactor;
	}
	
	public Protein getInteractor() {
		return interactor;
	}

	public List<String> getScores() {
		return Arrays.asList(scores.split("|"));
	}

	public List<String> getDatabases() {
		return Arrays.asList(databases.split("|"));
	}
		
}
