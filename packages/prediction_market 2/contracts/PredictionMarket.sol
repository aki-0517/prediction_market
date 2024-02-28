// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 < 0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarket is Ownable {
   uint internal numContracts = 0;

   struct Contract {
       address creator;
       string description;
       uint endTimestamp;
       mapping(uint => uint) sharesPerOption;
       uint[] options;
       uint price;
       bool resolved;
       uint winningOption;
       uint totalBetAmount;
   }

   mapping(uint => Contract) internal contracts;
   mapping(uint => mapping(uint => mapping(address => uint))) public betsPerOptionPerAddress;

   constructor(address initialOwner) Ownable(initialOwner) {}

   function createContract (
       string memory _description,
       uint _endTimestamp,
       uint _price,
       uint[] memory _options
   ) public onlyOwner() {
       Contract storage newContract = contracts[numContracts++];
       newContract.creator = msg.sender;
       newContract.description = _description;
       newContract.endTimestamp = _endTimestamp;
       newContract.price = _price;
       newContract.resolved = false;
       newContract.winningOption = 0;
       newContract.totalBetAmount = 0;

       for (uint i = 0; i < _options.length; i++) {
           newContract.options.push(_options[i]);
           newContract.sharesPerOption[_options[i]] = 0;
       }
   }

   function getContract(uint _index) public view returns (
       address creator,
       string memory description,
       uint endTimestamp,
       uint[] memory options,
       uint price,
       bool resolved,
       uint winningOption
   ) {
       Contract storage c = contracts[_index];
       return (
           c.creator,
           c.description,
           c.endTimestamp,
           c.options,
           c.price,
           c.resolved,
           c.winningOption
       );
   }

   function buyShares(uint _index, uint _option) public payable {
       Contract storage c = contracts[_index];
       require(!c.resolved, "Contract has already been resolved.");
       require(msg.value == c.price, "Incorrect amount of cUSD sent.");
       require(isValidOption(_index, _option), "Invalid option selected.");

       c.sharesPerOption[_option] += msg.value;
       c.totalBetAmount += msg.value;
       betsPerOptionPerAddress[_index][_option][msg.sender] += msg.value;
   }

   function resolveContract(uint _index, uint _winningOption) public {
       Contract storage c = contracts[_index];
       require(msg.sender == c.creator, "Only the creator can resolve the contract.");
       require(block.timestamp > c.endTimestamp, "Contract has not yet expired.");
       require(!c.resolved, "Contract has already been resolved.");
       require(isValidOption(_index, _winningOption), "Invalid winning option.");

       c.resolved = true;
       c.winningOption = _winningOption;
       // 報酬分配は次のステップで実装
   }

   function isValidOption(uint _index, uint _option) internal view returns (bool) {
       Contract storage c = contracts[_index];
       for (uint i = 0; i < c.options.length; i++) {
           if (c.options[i] == _option) {
               return true;
           }
       }
       return false;
   }

   // 報酬分配の実装を省略。Solidityでマッピングのキーをイテレートする直接的な方法はないため、
   // シェアホルダーごとの支払いを追跡し、適切に分配するための追加のロジックが必要です。
}