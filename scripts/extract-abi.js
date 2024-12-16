const fs = require('fs');
const path = require('path');
const hre = require("hardhat");

async function main() {
  // Get contract artifacts
  const PredictionMarket = await hre.artifacts.readArtifact("PredictionMarket");
  const PriceFeed = await hre.artifacts.readArtifact("IPriceFeed");

  // Create output directory if it doesn't exist
  const abiDir = path.join(__dirname, '..', 'abi');
  if (!fs.existsSync(abiDir)){
    fs.mkdirSync(abiDir);
  }

  // Write ABI files
  console.log("Extracting PredictionMarket ABI...");
  fs.writeFileSync(
    path.join(abiDir, 'PredictionMarket.abi'),
    JSON.stringify(PredictionMarket.abi, null, 2)
  );

  console.log("Extracting PriceFeed ABI...");
  fs.writeFileSync(
    path.join(abiDir, 'PriceFeed.abi'),
    JSON.stringify(PriceFeed.abi, null, 2)
  );

  // Write combined solidity binary files
  console.log("Extracting PredictionMarket binary...");
  fs.writeFileSync(
    path.join(abiDir, 'PredictionMarket.bin'),
    PredictionMarket.bytecode
  );

  console.log("ABIs and binaries extracted to /abi directory");
  console.log("\nTo generate Go bindings, run:");
  console.log('abigen --abi abi/PredictionMarket.abi --bin abi/PredictionMarket.bin --pkg contracts --out internal/contracts/prediction_market.go');
  console.log('abigen --abi abi/PriceFeed.abi --pkg contracts --out internal/contracts/price_feed.go');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
  