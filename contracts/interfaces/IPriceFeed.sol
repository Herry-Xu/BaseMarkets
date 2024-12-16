// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPriceFeed {
    function getLatestPrice() external view returns (int256);
    function getLatestTimestamp() external view returns (uint256);
} 