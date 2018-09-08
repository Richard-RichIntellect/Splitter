pragma solidity 0.4.24;

contract Splitter {
  address owner;

  mapping (address => uint256) pendingWithdrawals;

  event LogDetailsOfSplit(address addressOfAccountOne,address addressOfAccountTwo, uint256 valueOfAccountOne,uint256 valueOfAccountTwo);
  event LogDetailsOfRefundToOwner(address owner,address addressOfAccount, uint256 value);
  event LogDetailsofWithdrawal(address account, uint256 value);

  constructor () public payable {
    owner = msg.sender;
  }
  
  function split(address toAccountOne, address toAccountTwo) public payable returns (bool) {

    require(msg.sender == owner,"Cannot split funds unless you are the owner.");
    require(msg.value >= 0,"Cannot split funds as you do not have any ether.");
    uint256 amountPerPerson = msg.value / 2;
    uint256 remainder = msg.value - (amountPerPerson * 2);

    pendingWithdrawals[toAccountOne] += amountPerPerson;
    pendingWithdrawals[toAccountTwo] += amountPerPerson;

    emit LogDetailsOfSplit(toAccountOne,toAccountTwo,pendingWithdrawals[toAccountOne],pendingWithdrawals[toAccountTwo]);

    if (remainder > 0)
    {
      pendingWithdrawals[owner] += remainder;
    }
    return true;
  }

  function withdraw(address withdrawalAddress) public {
    require (pendingWithdrawals[withdrawalAddress] > 0,"Cannot withdraw funds as none exist.");
    uint amount = pendingWithdrawals[withdrawalAddress];
    pendingWithdrawals[withdrawalAddress] = 0;
    withdrawalAddress.transfer(amount);
    emit LogDetailsofWithdrawal(withdrawalAddress,amount);
  }

  function refund(address refundAddress) public {
    require(msg.sender == owner,"Cannot refund funds unless you are the owner.");
    require(pendingWithdrawals[refundAddress] > 0,"Cannot refund as no funds are available.");
    uint amount = pendingWithdrawals[refundAddress];
    emit LogDetailsOfRefundToOwner(owner,refundAddress,pendingWithdrawals[refundAddress]);
    pendingWithdrawals[refundAddress] = 0;
    owner.transfer(amount);
  }
}