var Splitter = artifacts.require("../contracts/Splitter.sol");

contract('Splitter', function (accounts) {
  let instance;
  let owner = accounts[0];
  let recepientOne = accounts[1]
  let recepientTwo = accounts[2]

  beforeEach(function () {
    return Splitter.new({from:owner})
      .then(function (_instance) {
        instance = _instance;
      });
  });

  it("should split funds between accounts", function () {

    let ownerTransaction;
    let recipientTransaction;
    let recipientTransactionTwo;

    let balance0 = web3.eth.getBalance(owner);
    let balance1 = web3.eth.getBalance(recepientOne);
    let balance2 = web3.eth.getBalance(recepientTwo);

    // You *need to return* the whole Promise chain

    return instance.transferAmount(recepientOne, recepientTwo, { from: owner, value: web3.toWei('10', 'ether') })
      .then(result => {
        console.log(web3.eth.getBalance(instance.address).toNumber());
        ownerTransaction = result;
        return instance.withdrawAmount(web3.toWei('5', 'ether'), { from: recepientOne })
      })
      .then(result => {
        recipientTransactionOne = result;
        return instance.withdrawAmount(web3.toWei('5', 'ether'), { from: recepientTwo })
      })
      .then(result => {
        recipientTransactionTwo = result;

        let ownerCurrentBalance = (balance0.minus(web3.toWei(10, 'ether'))).toNumber();
        let recipientCurrentBalanceOne = (balance1.plus(web3.toWei(5, 'ether'))).toNumber();
        let recipientCurrentBalanceTwo = (balance2.plus(web3.toWei(5, 'ether'))).toNumber();

        let tx0 = web3.eth.getTransaction(ownerTransaction.tx);
        let tx1 = web3.eth.getTransaction(recipientTransactionOne.tx);
        let tx2 = web3.eth.getTransaction(recipientTransactionTwo.tx);

        let ownerNewBalance = web3.eth.getBalance(owner).plus(tx0.gasPrice.mul(ownerTransaction.receipt.gasUsed)).toNumber();
        let recipientNewBalanceOne = web3.eth.getBalance(recepientOne).plus(tx1.gasPrice.mul(recipientTransactionOne.receipt.gasUsed)).toNumber();
        let recipientNewBalanceTwo = web3.eth.getBalance(recepientTwo).plus(tx2.gasPrice.mul(recipientTransactionTwo.receipt.gasUsed)).toNumber();

        assert.equal(ownerNewBalance, ownerCurrentBalance, "Balance 0 Check Fail");
        assert.equal(recipientNewBalanceOne, recipientCurrentBalanceOne, "Balance 1 Check Fail");
        assert.equal(recipientNewBalanceTwo, recipientCurrentBalanceTwo, "Balance 2 Check Fail");


      });
  }); 

  it("will try to withdraw 10 ether when 5 is avaiable", function () {

    return instance.transferAmount(recepientOne, recepientTwo, { from: owner, value: web3.toWei('10', 'ether') })
      .then(result => {
        ownerTransaction = result;
        return instance.withdrawAmount(web3.toWei('5', 'ether'),{ from: recepientOne })
      })
      .then(result => {
        recipientTransactionOne = result;
        return instance.withdrawAmount(web3.toWei('5', 'ether'), { from: recepientOne })
      })
      .then (result => {
        assert.isTrue(false);
      })
      .catch(result => {
        assert.isTrue(true);
      });
  });

  it("Will successfully withdraw ether", function () {

    return instance.transferAmount(recepientOne, recepientTwo, { from: owner, value: web3.toWei('10', 'ether') })
      .then(result => {
        console.log(web3.eth.getBalance(owner).toNumber());
        ownerTransaction = result;
        return instance.withdrawAmount(web3.toWei('2', 'ether'),{ from: recepientOne })
      })
      .then(result => {
        recipientTransactionOne = result;
        return instance.withdrawAmount(web3.toWei('1', 'ether'), { from: recepientOne })
      })
      .then(result => {
        recipientTransactionOne = result;
        return instance.withdrawAmount(web3.toWei('2', 'ether'), { from: recepientOne })
      })
      .then (result => {
        assert.isTrue(true);
      })
      .catch(result => {
        console.log(result);
        assert.isTrue(false);
      });
  });


  it("should pause contract and transfer funds back to owner", function () {

    let ownerCurrentBalance = web3.eth.getBalance(owner);
    let ownerTransaction;
    let recipientTransactionOne;
    let recipientTransactionTwo;

    return instance.transferAmount(recepientOne, recepientTwo, { from: owner, value: web3.toWei('1', 'ether') })
      .then(result => {
        ownerTransaction = result;
        return instance.stopContract({from: owner })
      })
      .then(result => {
        recipientTransactionOne = result;
        return instance.emergencyWithdraw({ from: owner })
      })
      .then(result => {
        recipientTransactionTwo = result;
        let tx0 = web3.eth.getTransaction(ownerTransaction.tx);
        let tx1 = web3.eth.getTransaction(recipientTransactionOne.tx);
        let tx2 = web3.eth.getTransaction(recipientTransactionTwo.tx);

        assert.isTrue(ownerCurrentBalance == web3.eth.getBalance(owner)
        .plus(tx0.gasPrice.mul(ownerTransaction.receipt.gasUsed))
        .plus(tx1.gasPrice.mul(recipientTransactionOne.receipt.gasUsed))
        .plus(tx2.gasPrice.mul(recipientTransactionTwo.receipt.gasUsed))
        .toNumber());
      })
      .then (result => {
        assert.isTrue(true);
      })
      .catch(result => {
        console.log(result);
        assert.isTrue(false);
      });
  });

  it("should fail when trying to withdraw when you are not the owner.", function () {

    return instance.transferAmount(recepientOne, recepientTwo, { from: owner, value: web3.toWei('10', 'ether') })
      .then(result => {
        console.log(web3.eth.getBalance(owner).toNumber());
        ownerTransaction = result;
        return instance.stopContract({from: owner })
      })
      .then(result => {
        recipientTransactionOne = result;
        return instance.emergencyWithdraw({ from: recepientOne })
      })
      .then(result => {
        assert.isTrue(false);
      })
      .catch(result => {
        console.log(result);
        assert.isTrue(true);
      });
  });

});