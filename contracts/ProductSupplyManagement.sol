// SPDX-License-Identifier: GPL-3.0

/*Mini Supply Chain*/
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProductPaymentContract.sol";


contract ProductSupplyManagement is Ownable{

    enum trackProductStatus{Created, OrderConfirmed, Delivered}

    struct product{
        ProductPaymentContract productPayment;
        string productSKU;
        uint productPrice;
        ProductSupplyManagement.trackProductStatus status;
    }
    
    mapping(uint => product) public items;
    uint productNumber;
    event  ProductStatusUpdate(uint productNumber,uint _step, address moneykeep_adress);

    function createProduct(string memory entered_productSKU, uint entered_productPrice) public onlyOwner{ 
        ProductPaymentContract _newproductkeep = new ProductPaymentContract(this,entered_productPrice,productNumber);
        items[productNumber].productSKU = entered_productSKU;
        items[productNumber].productPrice = entered_productPrice;
        items[productNumber].status = trackProductStatus.Created;
        emit ProductStatusUpdate(productNumber,uint(items[productNumber].status), address(_newproductkeep));
        productNumber++;
    }

    function makeDelivery(uint product_number) public onlyOwner{
        require(items[product_number].status == trackProductStatus.OrderConfirmed,"Product is not eligible for delivery");
        items[product_number].status = trackProductStatus.Delivered;
        emit ProductStatusUpdate(product_number,uint(items[product_number].status),address(items[product_number].productPayment));
    }

    function makePayment(uint product_number) public payable{
        require(items[product_number].productPrice == msg.value, "Please make full payment"); 
        require(items[product_number].status == trackProductStatus.Created,"Product does not exist or has been delivered"); 
        items[product_number].status = trackProductStatus.OrderConfirmed;
        emit ProductStatusUpdate(product_number,uint(items[product_number].status),address(items[product_number].productPayment)); 
    }
}