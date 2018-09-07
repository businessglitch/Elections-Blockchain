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

	// update candidate vote count
	function vote(uint _id) public {
		//record that voter has voted
		account = msg.sender;
		voters[account] = true;
		candidates[_id].voteCount++;
		
	}
	
	// Fetch Candidate
		//takes id and returns candidate
	mapping(uint => Candidate) public candidates;

	// Store accounts that have voted
	mapping(address => bool) public voters;

	// Store Candidate count
	uint public candidatesCount;
	
	constructor() public {
		addCandidate("Fahad Hayat");
		addCandidate("Imran Khan");
  	}

}