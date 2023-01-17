// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract task {
    uint256 totalSubmissions;

    struct User
    {
        // Declaring different 
        // structure elements
        string name;
        uint8 age;
    }

    mapping (uint256 => User) rollno;



    constructor() {
        // console.log("Yo yo, I am a contract and I am smart");
    }

    function submit(string calldata userName, uint8 userAge) public{
        totalSubmissions += 1;
        User memory user = User({name : userName, age : userAge});
        rollno[totalSubmissions] = user;
        console.log("%s has submitted. id : %d" , msg.sender, totalSubmissions);
    }

    function fetchUserInfo(uint8 id) public view returns (User memory) {
        return rollno[id];
    }

    function getTotalSubmissions() public view returns(uint256) {
        console.log("we have total %d total submissions", totalSubmissions);
        return totalSubmissions;
    }
}