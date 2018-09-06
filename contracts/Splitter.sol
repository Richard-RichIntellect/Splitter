pragma solidity 0.4.24;

contract Splitter {
  address owner;

  event LogDetails(string location);
  event LogDetailsAndValue(string location, uint256 value);
  event LogDetailsAndAddress(string location, address value);
  constructor () public payable {
    owner = msg.sender;
  }
  
  function transferAmount(address addressOfAccount, uint256 amount) private  returns (bool)
  {
    addressOfAccount.transfer(amount);
    return true;
  }

  function split(address toAccountOne, address toAccountTwo) public payable returns (bool) {
    // emit LogDetailsAndAddress("toAccountOne",toAccountOne);
    // emit LogDetailsAndAddress("toAccountTwo",toAccountTwo);
    // emit LogDetails("Pre Require Split...");
    require(msg.sender == owner,"Cannot split funds unless you are the owner.");
    // emit LogDetails("Pre Require Split Amount unavailable...");
    require(msg.value >= 0,"Cannot split funds as you do not have any ether.");
    // emit LogDetails("Pre calculation...");
    uint256 amountPerPerson = msg.value / 2;
    uint256 remainder = msg.value - (amountPerPerson * 2);
    //emit LogDetails("Pre Transfer Account 1...");
    require(transferAmount(toAccountOne,amountPerPerson),"Transfer failed");
    //emit LogDetailsAndValue("Pre Transfer Account 2... Account 1",amountPerPerson);
    require(transferAmount(toAccountTwo,amountPerPerson),"Transfer failed");
    //emit LogDetailsAndValue("Pre Remainder... Account 2",amountPerPerson);
    
    if (remainder > 0)
    {
      //emit LogDetailsAndValue("Pre End... Remainder",remainder);
      require(transferAmount(msg.sender,remainder),"Transfer failed");
    }
    //emit LogDetails("Pre True");
    return true;
  }

}