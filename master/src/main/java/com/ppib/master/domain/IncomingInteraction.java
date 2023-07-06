package com.ppib.master.domain;

import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
public class IncomingInteraction {
	// TODO: IncomingInteraction and OutgoingInteraction classes to inherit from one base class.
	
	@RelationshipId
	private Long id; //
	
	private final String scores;
	
	private final String databases;
	
	@TargetNode
	private final Protein interactor;
	
	public IncomingInteraction(String scores, String databases, Protein interactor) {
		this.scores = scores;
		this.databases = databases;
		this.interactor = interactor;
	}
	
}
