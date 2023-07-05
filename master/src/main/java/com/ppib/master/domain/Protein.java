package com.ppib.master.domain;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.schema.Relationship.Direction;

@Node
public class Protein {
	
	@Id
	private final String uniprotid;
	@Property("ensemblid")
	private String ensembl_ids;
	@Property("geneid")
	private String gene_ids;
	
	@Relationship(type = "INTERACT", direction = Direction.INCOMING)
	private List<IncomingInteraction> interacting_proteins1;
	
	@Relationship(type = "INTERACT", direction = Direction.OUTGOING)
	private List<OutgoingInteraction> interacting_proteins2;
	
	public Protein(String uniprotid, String ensembl_ids, String gene_ids) {
		this.uniprotid = uniprotid;
		this.ensembl_ids = ensembl_ids;
		this.gene_ids = gene_ids;
	}
	
	public String getUniProtID() {
		return uniprotid;
	}
	
	public List<String> getEnsemblIDs() {
		return new ArrayList<>(Arrays.asList(ensembl_ids.split("|")));
	}
	
	public List<String> getGeneIDs() {
		return new ArrayList<>(Arrays.asList(gene_ids.split("|")));
	}
	
}
