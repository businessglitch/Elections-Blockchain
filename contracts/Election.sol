pragma solidity ^0.4.24;

contract Election {
	// Model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;	
	}

	// Fetch Candidate
		//takes id and returns candidate
	mapping(uint => Candidate) public candidates;

	// Store accounts that have voted
	mapping(address => bool) public voters;

	// Store Candidate count
	uint public candidatesCount;

	//voted Event
	event votedEvent(uint _id);
		

	constructor() public {
		addCandidate("Fahad Hayat");
		addCandidate("Imran Khan");
  	}

	// Store a candidate
	function addCandidate(string _name) private {
		candidatesCount ++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	// update candidate vote count
	function vote(uint _id) public {
		var account = msg.sender;
		//require  that voter hasnt voted before
		require(!voters[account]);
		
		//require that it is a valid candidate
		require (_id > 0 && _id <= candidatesCount);
		
		voters[account] = true;
		candidates[_id].voteCount++;
		//trigger voted event
		votedEvent(_id);
	}
}