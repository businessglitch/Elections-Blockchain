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

      return App.render()
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
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

      for (var i = 1; i <= count; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          //Render candidate Results
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          candidatesResults.append(candidateTemplate);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error)
    });
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

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
