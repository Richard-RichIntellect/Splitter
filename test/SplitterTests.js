var Splitter = artifacts.require("../contracts/Splitter.sol");

contract('Splitter', function (accounts) {
  it("should split funds between accounts", function () {
    let instance;
    let transaction0;
    let transaction1;
    let transaction2;

    let balance0 = web3.eth.getBalance(web3.eth.accounts[0]);
    let balance1 = web3.eth.getBalance(web3.eth.accounts[1]);
    let balance2 = web3.eth.getBalance(web3.eth.accounts[2]);

    // You *need to return* the whole Promise chain
    return Splitter.deployed()
      .then(_instance => {
        instance = _instance;
        return instance.split(web3.eth.accounts[1], web3.eth.accounts[2], { from: web3.eth.accounts[0], value: web3.toWei('10', 'ether') })
          .then(result => {
            transaction0 = result;
            return instance.withdraw(web3.eth.accounts[1], { from: web3.eth.accounts[1] })
          })
          .then(result => {
            transaction1 = result;
            return instance.withdraw(web3.eth.accounts[2], { from: web3.eth.accounts[2] })
          })
          .then(result => {
            transaction2 = result;

            let currentBalance0 = (balance0.minus(web3.toWei(10, 'ether'))).toNumber();
            let currentBalance1 = (balance1.plus(web3.toWei(5, 'ether'))).toNumber();
            let currentBalance2 = (balance2.plus(web3.toWei(5, 'ether'))).toNumber();

            let tx0 = web3.eth.getTransaction(transaction0.tx);
            let tx1 = web3.eth.getTransaction(transaction1.tx);
            let tx2 = web3.eth.getTransaction(transaction2.tx);

            let newBalance0 = web3.eth.getBalance(web3.eth.accounts[0]).plus(tx0.gasPrice.mul(transaction0.receipt.gasUsed)).toNumber();
            let newBalance1 = web3.eth.getBalance(web3.eth.accounts[1]).plus(tx1.gasPrice.mul(transaction1.receipt.gasUsed)).toNumber();
            let newBalance2 = web3.eth.getBalance(web3.eth.accounts[2]).plus(tx2.gasPrice.mul(transaction2.receipt.gasUsed)).toNumber();

            assert.equal(newBalance0, currentBalance0, "Balance 0 Check Fail");
            assert.equal(newBalance1, currentBalance1, "Balance 1 Check Fail");
            assert.equal(newBalance2, currentBalance2, "Balance 2 Check Fail");

          });
      });
  });

  it("will return deposits not taken", function () {
    let instance;
    let transaction0;
    let transaction1;
    let transaction2;

    let balance0 = web3.eth.getBalance(web3.eth.accounts[0]);
    let balance1 = web3.eth.getBalance(web3.eth.accounts[1]);
    let balance2 = web3.eth.getBalance(web3.eth.accounts[2]);

    // You *need to return* the whole Promise chain
    return Splitter.deployed()
      .then(_instance => {
        instance = _instance;
        return instance.split(web3.eth.accounts[1], web3.eth.accounts[2], { from: web3.eth.accounts[0], value: web3.toWei('10', 'ether') })
          .then(result => {
            transaction0 = result;
            return instance.withdraw(web3.eth.accounts[1], { from: web3.eth.accounts[1] })
          })
          .then(result => {
            transaction1 = result;
            return instance.reject(web3.eth.accounts[2], { from: web3.eth.accounts[0] })
          })
          .then(result => {
            transaction2 = result;

            let currentBalance0 = (balance0.minus(web3.toWei(5, 'ether'))).toNumber();
            let currentBalance1 = (balance1.plus(web3.toWei(5, 'ether'))).toNumber();
            let currentBalance2 = (balance2.plus(web3.toWei(0, 'ether'))).toNumber();

   

            let tx0 = web3.eth.getTransaction(transaction0.tx);
            let tx1 = web3.eth.getTransaction(transaction1.tx);
            let tx2 = web3.eth.getTransaction(transaction2.tx);

            let newBalance0 = web3.eth.getBalance(web3.eth.accounts[0]).plus(tx0.gasPrice.mul(transaction0.receipt.gasUsed).plus(tx2.gasPrice.mul(transaction2.receipt.gasUsed))).toNumber();
            let newBalance1 = web3.eth.getBalance(web3.eth.accounts[1]).plus(tx1.gasPrice.mul(transaction1.receipt.gasUsed)).toNumber();
            let newBalance2 = web3.eth.getBalance(web3.eth.accounts[2]).toNumber();

            assert.equal(newBalance0 , currentBalance0, "Balance 0 Check Fail");
            assert.equal(newBalance1, currentBalance1, "Balance 1 Check Fail");
            assert.equal(newBalance2, currentBalance2, "Balance 2 Check Fail");

          });
      });
  });
});