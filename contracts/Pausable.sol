pragma solidity 0.4.24;

contract Pausable {
  bool isStopped = false;
  address authorizer;

  constructor (address ownerAddress) public payable {
    authorizer = ownerAddress;
  }

  modifier onlyAuthorized {
    require(authorizer == msg.sender,"Unauthorized");
    _;
  }

  function stopContract() public onlyAuthorized {
    isStopped = true;
  }

  function resumeContract() public onlyAuthorized {
    isStopped = false;
  }

  modifier onlyIfRunning {
    require(!isStopped,"Contract Stopped.");
    _;
  }

  modifier onlyWhenStopped {
    require(isStopped,"Contract still active.");
    _;
  }

}