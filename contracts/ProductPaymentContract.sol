// SPDX-License-Identifier: GPL-3.0

/*Mini Supply Chain*/
pragma solidity ^0.8.0;

import "./ProductSupplyManagement.sol";

contract ProductPaymentContract{
        uint public product_priceinWei;
        uint public paymentcomplete;
        uint public index;

        ProductSupplyManagement parentContract;

        constructor(ProductSupplyManagement _parentContract,uint _priceinWei,uint _index) public{
            product_priceinWei = _priceinWei;
            index = _index;
            parentContract =_parentContract;
            
        }

        receive() external payable{
            require(paymentcomplete == 0 , "Payment already complete");
            require(product_priceinWei == msg.value,"Please pay in full amount");
            paymentcomplete += msg.value;
            (bool success,) = address(parentContract).call{value : msg.value}(abi.encodeWithSignature("makePayment(uint256)",index));
            require(success,"The transaction was unsuccessful. Cancelling...");
        }

        fallback ()external{}
    
    }