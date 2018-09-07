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
});