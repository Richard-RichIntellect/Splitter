var Splitter = artifacts.require("../contracts/Splitter.sol");

contract('Splitter', function (accounts) {
  it("should increment", function () {
    let instance;
    
    let balance0 = web3.eth.getBalance(web3.eth.accounts[0]);
    let balance1 = web3.eth.getBalance(web3.eth.accounts[1]);
    let balance2 = web3.eth.getBalance(web3.eth.accounts[2]);

    console.log(balance0);
    console.log(balance1);
    console.log(balance2);
    
    // You *need to return* the whole Promise chain
    return Splitter.deployed()
      .then(_instance => {
        return _instance.split(web3.eth.accounts[1], web3.eth.accounts[2], { from: web3.eth.accounts[0], value: web3.toWei('10','ether') });
        
      }).then(success => {

        let newBalance0 = web3.eth.getBalance(web3.eth.accounts[0]).toNumber();
        let newBalance1 = web3.eth.getBalance(web3.eth.accounts[1]).toNumber();
        let newBalance2 = web3.eth.getBalance(web3.eth.accounts[2]).toNumber();

        let currentBalance0 = (balance0.plus(web3.toWei(5, 'ether'))).toNumber()
        let currentBalance1 = (balance1.plus(web3.toWei(5, 'ether'))).toNumber();
        let currentBalance2 = (balance2.plus(web3.toWei(5, 'ether'))).toNumber();

        assert.isTrue(newBalance0 < currentBalance0, "Balance 0 Check Fail");
        assert.isTrue(newBalance1 === currentBalance1, "Balance 1 Check Fail");
        assert.isTrue(newBalance2 === currentBalance2, "Balance 2 Check Fail");

      });
  });
});