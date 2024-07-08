const { ethers } = require("ethers");

const letapayContractAddress = "0x4C849A3736694567cbd304fd8526339ed29b23AB";

const cUsdAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

const decimals = 18;

function cUsdToWei(amount) {
    const amountInSmallestUnit = ethers.parseUnits(amount.toString(), decimals);
    return amountInSmallestUnit;
}

function weiToCusd(amountInWei) {
    const amountInCusd = ethers.formatUnits(amountInWei, decimals);
    return amountInCusd;
}

module.exports = { cUsdToWei, weiToCusd,cUsdAddress ,letapayContractAddress };