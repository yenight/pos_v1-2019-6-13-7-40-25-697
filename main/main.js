'use strict';

const printReceipt = barcodes => {
    let receiptItems = generateReceipt(barcodes);
    let receipt = printReceiptItems(receiptItems);
    console.log(receipt);
};

const generateReceipt = barcodes => {
    let allItems = loadAllItems();
    let promotions = loadPromotions();
    let receiptItems = [];
    for (let i = 0; i < barcodes.length; i++) {
        if (receiptItems.findIndex(value => value.barcode === barcodes[i]) < 0 && barcodes[i].indexOf('-') === -1) {
            receiptItems.push(generateReceiptItem(barcodes[i], allItems, promotions[0]));
        } else if (barcodes[i].indexOf('-') > -1) {
            let multiBarcode = barcodes[i].split('-');
            if (receiptItems.findIndex(value => value.barcode === multiBarcode[0]) < 0) {
                receiptItems.push(generateReceiptItem(multiBarcode[0], allItems, promotions[0]));
                let index = receiptItems.findIndex(value => value.barcode === multiBarcode[0]);
                receiptItems[index].count = parseFloat(multiBarcode[1]);
                receiptItems[index].totalPrice = receiptItems[index].price * receiptItems[index].count;
            } else {
                let index = receiptItems.findIndex(value => value.barcode === multiBarcode[0]);
                receiptItems[index].count += parseFloat(multiBarcode[1]);
                receiptItems[index].totalPrice = receiptItems[index].price * receiptItems[index].count;
            }
        } else {
            let index = receiptItems.findIndex(value => value.barcode === barcodes[i]);
            receiptItems[index].count++;
            receiptItems[index].totalPrice += receiptItems[index].price;
        }
    }
    return calculatePromotion(receiptItems);
};

const calculatePromotion = receiptItems => {
    for (let i = 0; i < receiptItems.length; i++) {
        if (receiptItems[i].promotion === true && receiptItems[i].count > 2) {
            receiptItems[i].totalPrice -= Math.floor(receiptItems[i].count / 3) * receiptItems[i].price;
        }
    }
    return receiptItems;
}

const generateReceiptItem = (barcode, allItems, promotions) => {
    const itemIndex = allItems.findIndex((value => barcode === value.barcode))
    let isInPromotion = false;
    if (promotions.barcodes.indexOf(barcode) >= 0) {
        isInPromotion = true;
    }
    return {barcode: allItems[itemIndex].barcode, name: allItems[itemIndex].name, unit: allItems[itemIndex].unit, price: allItems[itemIndex].price, count: 1, totalPrice: allItems[itemIndex].price, promotion: isInPromotion}
};

const printReceiptItems = receiptItems => {
    let receipt = `***<没钱赚商店>收据***\n`;
    receipt += `${printItems(receiptItems)}`;
    receipt += `----------------------\n`;
    receipt += `${printTotalPrice(receiptItems)}\n`;
    receipt += `${printTotalPromotion(receiptItems)}\n`;
    receipt += `**********************`;
    return receipt;
}

const printItems = receiptItems => {
    let receiptItemsString = ``;
    for (let i = 0; i < receiptItems.length; i++) {
        receiptItemsString += `名称：${receiptItems[i].name}，数量：${receiptItems[i].count}${receiptItems[i].unit}，单价：${receiptItems[i].price.toFixed(2)}(元)，小计：${receiptItems[i].totalPrice.toFixed(2)}(元)\n`;
    }
    return receiptItemsString;
}

const printTotalPrice = receiptItems => {
    let totalPrice = 0;
    for (let i = 0; i < receiptItems.length; i++) {
        totalPrice += receiptItems[i].totalPrice;
    }
    return `总计：${totalPrice.toFixed(2)}(元)`;
}

const printTotalPromotion = receiptItems => {
    let totalPromotionPrice = 0;
    for (let i = 0; i < receiptItems.length; i++) {
        totalPromotionPrice += receiptItems[i].price * receiptItems[i].count - receiptItems[i].totalPrice;
    }
    return `节省：${totalPromotionPrice.toFixed(2)}(元)`;
}




