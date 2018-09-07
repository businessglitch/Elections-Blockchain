var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
	var electionInstance;
	// body...
	it("initializes with two candidates", function() {
		return Election.deployed().then(function(instance) {
			return instance.candidatesCount()
		}).then(function(count) {
			assert.equal(count.toNumber(),2);
		});
	});

	it("initializes the candidates with the correct values" , function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance
			return electionInstance.candidates(1)
		}).then(function(candidate) {
			assert.equal(candidate[0], 1, "contains the correct id");
			assert.equal(candidate[1], "Fahad Hayat","contains the correct name");
			assert.equal(candidate[2], 0,"contains the correct voteCount");

			return electionInstance.candidates(2)
		}).then(function(candidate) {
			assert.equal(candidate[0], 2,"contains the correct id");
			assert.equal(candidate[1], "Imran Khan","contains the correct name");
			assert.equal(candidate[2], 0,"contains the correct voteCount");
		})
	})

	it("allows a voter to cast a vote", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, {from: accounts[0]});
		}).then(function(recipt) {
			return electionInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted, "the voter has been marked as voted");
			return electionInstance.candidates(candidateId);
		}).then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount,1, "Candidtates votes has been incremented");
		});
	});

	it("throws an exception for invalid candidate", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.vote(99, {from: accounts[0]})
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "message contians the word 'revert' ");
			return electionInstance.candidates(1);
		}).then(function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "Candidate1 did not recieve any votes");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 0, "Candidate2 did not recieve any votes");
		});
	});

	it("throws an exception for double voting", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance
			candidateId = 2
			electionInstance.vote(candidateId, {from: accounts[1]});
			return electionInstance.candidates(candidateId);
		}).then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "Candidate successfully recieved a vote")
			//try to vote again
			return electionInstance.vote(candidateId, {from: accounts[1]});
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "message contians the word 'revert' ");
			return electionInstance.candidates(1);
		}).then(function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "Candidate1 did not recieve any votes");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 1, "Candidate2 did not recieve any votes");
		});
	})
});