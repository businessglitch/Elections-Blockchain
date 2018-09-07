App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefinied') {
      // If a web instance is already provided by Meta Mask
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider);
    } else {
      // specify a default provider
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      //Initiate a new truffle contract by the artifact
      App.contracts.Election = TruffleContract(election);
      // connect a provider to interact with the contract
      App.contracts.Election.setProvider(App.web3Provider);
      // Listen to events from the Server
      App.listenForEvents();

      return App.render()
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event);

        App.render()
      });
    });
  },

  render() {
    var electionInstance;
    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    //Load account data
    web3.eth.getCoinbase( function(err, account) {
      if (err === null) {
        App.account = account
        $('#accountAddress').html('Your account: ' + account);
      }
    });

    //Load contract data 
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(count) {
      var candidatesResults = $('#candidatesResults');
      candidatesResults.empty();
      var candidateSelect = $('#candidatesSelect')
      candidateSelect.empty();

      for (var i = 1; i <= count; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          //Render candidate Results
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          candidatesResults.append(candidateTemplate);
          // Append Candidate Option to Select Box
          candidateOption = '<option value="'+ id +'">' + name + '</option>'
          candidateSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
      
    }).then(function(hasVoted){
      // Hide the form if user has already voted
      if(hasVoted) {
        $('form').hide()
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error)
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, {from:App.account})
    }).then(function(result) {
      // wait for votes to update
      $('#loader').hide();
      $('#content').show();
    }).catch(function(err) {
      console.error(err);
    }); 
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
