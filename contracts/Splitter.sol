pragma solidity 0.4.24;

import "./Pausable.sol";

contract Splitter is Pausable {

  mapping (address => uint256) pendingWithdrawals;

  event LogDetailsOfTransferAmount(address sender,uint256 amountSent,address accountOne,address accountTwo);
  event LogDetailsofWithdrawal(address account, uint256 value);
  event LogDetailsofEmergencyWithdrawal(address account);

  constructor () public {  }

  function transferAmount(address toAccountOne, address toAccountTwo) public onlyIfRunning payable returns (bool) {

    emit LogDetailsOfTransferAmount(msg.sender,msg.value, toAccountOne,toAccountTwo);
    require(msg.value >= 0,"Cannot split funds as you do not have any ether.");
    uint256 amountPerPerson = msg.value / 2;
    uint256 remainder = msg.value - (amountPerPerson * 2);

    pendingWithdrawals[toAccountOne] += amountPerPerson;
    pendingWithdrawals[toAccountTwo] += amountPerPerson;
    
    if (remainder > 0)
    {
      pendingWithdrawals[msg.sender] += remainder;
    }

    return true;
  }

  function withdrawAmount(uint256 amount) public onlyIfRunning {
    emit LogDetailsofWithdrawal(msg.sender,amount);
    require (amount <= pendingWithdrawals[msg.sender],"Funds not available.");
    pendingWithdrawals[msg.sender] -= amount;
    msg.sender.transfer(amount);
  }

  function emergencyWithdraw() public onlyWhenStopped onlyOwner {
    emit LogDetailsofEmergencyWithdrawal(msg.sender);
    msg.sender.transfer(address(this).balance);
  }
}