App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  vc: [],


  init: async function () {
    return App.initWeb3();
  },

  initWeb3: async function () {
    ethereum.autoRefreshOnNetworkChange = false;
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      //window.ethereum.enable();

    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();

      return App.render();

    });
  },

  // Listen for events emitted from the contract
  listenForEvents: async function () {
    App.contracts.Election.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393

      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", { event })
        // Reload when a new vote is recorded
        //console.log(App.vc);
        //App.render();
      });
    });
  },

  //responsible to showing and hiding of contents
  render: async function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var aftervote = $("#myChart");

    loader.show();
    content.hide();
    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account's address : " + account);
      }
    });

    // Load contract data
    await App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function (candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();
      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      if (App.candidatesCount == 0) {
        App.candidatesCount = candidatesCount;
      }

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          App.vc = [...App.vc, voteCount['c'][0]];
          // Render candidate Result
          //var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          var candidateTemplate = "</br><h3>" + name + " : " + voteCount + "</h3>";
          candidatesResults.append(candidateTemplate);
          //console.log(App.vc);
          // App.vc = [...App.vc, JSON.stringify(voteCount)];

          App.pieShow();
          // console.log(App.vc);
          // Render candidate ballot option

          var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
          candidatesSelect.append(candidateOption);
        });
      }

      return electionInstance.voters(App.account);
    }).then(function (hasVoted) {
      // Do not allow a user to vote
      if (hasVoted) {
        $('form').hide();
        aftervote.show();
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });
  },

  //responsible for showing piechart
  pieShow: function () {
    const myChart = document.getElementById('myChart').getContext('2d');
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = 'White';

    //console.log(App.vc);

    new Chart(myChart, {
      type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: ['AAP', 'BJP', 'CONGRESS', 'NOTA'],
        datasets: [{
          label: 'Votes',
          data:
            /*  [...App.vc, App.vc.reduce((a, b) => a + b, 0)] */
            App.vc
          ,
          //backgroundColor:'green',
          backgroundColor: [
            'rgba(255, 99, 132, 0.9)',
            'rgba(54, 162, 235, 0.9)',
            'rgba(255, 206, 86, 0.9)',
            'rgba(75, 92, 192, 0.9)',
            'rgba(25, 62, 112, 0.9)'
          ],
          borderWidth: 2,
          borderColor: '#777',
          hoverBorderWidth: 3,
          hoverBorderColor: 'white'
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Current Votes Standings',
          fontSize: 25
        },
        legend: {
          display: true,
          fontSize: 1,
          align: 'center',
          position: 'left',
          labels: {
            fontColor: 'white'
          },

        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            bottom: 100,
            top: 0
          }
        },
        tooltips: {
          enabled: true
        }
      }
    });


  },

  //responsible for casting vote to a candidate
  castVote: function () {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function (result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
      //alert("Thank you for voting");
      $("#myModal").show();
      $(".chart-container").hide();
      //window.location.reload();
      App.render();
    }).catch(function (err) {
      console.error(err);
    });
  }
};


//inits the things on loading of page
$(function () {
  $(window).load(function () {
    App.init();
    App.pieShow();
  });
});

