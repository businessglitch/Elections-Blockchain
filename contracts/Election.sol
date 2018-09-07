pragma solidity ^0.4.24;

contract Election {
	// Model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;	
	}
	// Store a candidate
	function addCandidate(string _name) private {
		candidatesCount ++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	function incrementVote(uint _id) public {
		candidates[_id].voteCount++;
	}
	
	// Fetch Candidate
		//takes id and returns candidate
	mapping(uint => Candidate) public candidates;

	// Store Candidate count
	uint public candidatesCount;
	
	constructor() public {
		addCandidate("Fahad Hayat");
		addCandidate("Imran Khan");
  	}

}