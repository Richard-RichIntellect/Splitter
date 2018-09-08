pragma solidity 0.4.24;

contract Splitter {
  address owner;

  mapping (address => uint256) pendingWithdrawals;
  bool isStopped = false;

  event LogDetailsOfTransferAmount(uint256 amountSent,address accountOne,uint256 valueOne,address accountTwo,uint256 valueTwo,uint256 remainder);
  event LogDetailsofWithdrawal(address account, uint256 value);
  event LogDetailsofEmergencyWithdrawal(address account, uint256 value);

  constructor () public payable {
    owner = msg.sender;
  }

  modifier onlyAuthorized {
    require(owner == msg.sender,"Unauthorized");
    _;
  }

  function stopContract() public onlyAuthorized {
    isStopped = true;
  }

  function resumeContract() public onlyAuthorized {
    isStopped = false;
  }

  modifier stoppedInEmergency {
    require(!isStopped,"Contract Stopped.");
    _;
  }

  modifier onlyWhenStopped {
    require(isStopped,"Contract still active.");
    _;
  }

  function transferAmount(address toAccountOne, address toAccountTwo) public stoppedInEmergency payable returns (bool) {

    require(msg.value >= 0,"Cannot split funds as you do not have any ether.");
    uint256 amountPerPerson = msg.value / 2;
    uint256 remainder = msg.value - (amountPerPerson * 2);

    pendingWithdrawals[toAccountOne] += amountPerPerson;
    pendingWithdrawals[toAccountTwo] += amountPerPerson;
    
    if (remainder > 0)
    {
      pendingWithdrawals[msg.sender] += remainder;
    }

    emit LogDetailsOfTransferAmount(msg.value, toAccountOne,pendingWithdrawals[toAccountOne],toAccountTwo,pendingWithdrawals[toAccountTwo],remainder);

    return true;
  }

  function withdrawAmount(uint256 amount) public stoppedInEmergency {
    require (amount <= pendingWithdrawals[msg.sender],"Funds not available.");
    pendingWithdrawals[msg.sender] = 0;
    msg.sender.transfer(amount);
    emit LogDetailsofWithdrawal(msg.sender,amount);
  }

  function emergencyWithdraw() public onlyWhenStopped onlyAuthorized {
    msg.sender.transfer(address(this).balance);
    emit LogDetailsofEmergencyWithdrawal(msg.sender,address(this).balance);
  }
}