pragma solidity 0.4.24;

contract Splitter {
  address owner;

  mapping (address => mapping(address => uint256)) pendingWithdrawals;

  event LogDetailsOfSplit(address addressOfOwner,address addressOfReceiver, uint256 value);

  constructor () public payable {
    owner = msg.sender;
  }
  
  function transferAmount(address addressOfAccount, uint256 amount) private  returns (bool)
  {
    pendingWithdrawals[owner][addressOfAccount] += amount;
    emit LogDetailsOfSplit(owner,addressOfAccount,pendingWithdrawals[owner][addressOfAccount]);
    return true;
  }

  function split(address toAccountOne, address toAccountTwo) public payable returns (bool) {

    require(msg.sender == owner,"Cannot split funds unless you are the owner.");
    require(msg.value >= 0,"Cannot split funds as you do not have any ether.");
    uint256 amountPerPerson = msg.value / 2;
    uint256 remainder = msg.value - (amountPerPerson * 2);

    require(transferAmount(toAccountOne,amountPerPerson),"Transfer failed");
    require(transferAmount(toAccountTwo,amountPerPerson),"Transfer failed");

    if (remainder > 0)
    {
      require(transferAmount(msg.sender,remainder),"Transfer failed");
    }
    return true;
  }

  function withdraw(address withdrawalAddress) public {
    uint amount = pendingWithdrawals[owner][withdrawalAddress];

    pendingWithdrawals[owner][withdrawalAddress] = 0;
    withdrawalAddress.transfer(amount);
  }

  function reject(address rejectAddress) public {
    require(msg.sender == owner,"Cannot refund funds unless you are the owner.");
    uint amount = pendingWithdrawals[owner][rejectAddress];
    emit LogDetailsOfSplit(owner,rejectAddress,amount);
    pendingWithdrawals[owner][rejectAddress] = 0;
    owner.transfer(amount);

  }
}