## Install the app

```
npm install
npm install -g testrpc
```

## Start the app

```
// start app for a parent wallet setting an address
REACT_APP_ADDRESS="0xa88617319578e45b785c190c421544727ee72467" REACT_APP_PARENT="" npm start
// start app for a children wallet (default) setting an address
REACT_APP_ADDRESS="0xa88617319578e45b785c190c421544727ee72467" npm start
```

## Use example (using testrpc)

1. On a terminal, type `testrpc` to start the on memory blockchain. Take 3 of the addresses that testrpc generates. For example:
```

0xb26c7210147a38827583449333eb2c2875c84124 - parents' address
0x2c857ed8008bfa7ee352dad6167f46ef6888ac06 - child's address
0x0b1559b184848a1d53dee60fcf2c522110e5a081 - shop's address (antonio)
```

2. Open a new terminal instance and type `truffle migrate` (in the `smart-contract` folder) to deploy the contract.
```
Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x2847dc9f2efec3cd9d5795787b12fe9f19b42015ce07e7fef211ae1765d83eb7
  Migrations: 0x45d8caa4916c2c536e0dd938f844c17147ea8f51
Saving successful migration to network...
  ... 0x7bc7c35a86e11bb64ec1c3a852d95d72ffc87783b85d9dffbbf64d6b8c24980d
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying ChildrenWallet...
  ... 0xdf1f496924085b15445aa896bb3314b7e37a369c20f858cd6a5c4b689c8509c8
  ChildrenWallet: 0xf3073cb06c5cf99f1e2e5fb6d7d9b7eff39e497d
Saving successful migration to network...
  ... 0xa7cd3dd90a216891dc0e788edc105ba12a866f882374d57aa456c5d4ac3db044
Saving artifacts...
```
Your contract is on testrpc memory blockchain.

`0xf3073cb06c5cf99f1e2e5fb6d7d9b7eff39e497d` is the address for ChildrenWallet contract.
You should save it.

3. On another tab, type `cd ..` && `cd frontend-app`.
4. Open `src/App.js` and replace the contractAddress variable with your contract's address.
5. Type `REACT_APP_ADDRESS="0xb26c7210147a38827583449333eb2c2875c84124" REACT_APP_PARENT="" npm start` to run parents' wallet on http://localhost:3000.
6. On parents' wallet, use the "Add allowed" functionality:  write as name "antonio" and "0x0b1559b184848a1d53dee60fcf2c522110e5a081" as its shop address. Press the button. Now, "antonio" is an allowed place for children to buy things.
7. On another tab, type `REACT_APP_ADDRESS="0x2c857ed8008bfa7ee352dad6167f46ef6888ac06" npm start` to run child's wallet on http://localhost:3001.
8. On child's wallet DApp, try the 'Can buy?' functionality writing "0x0b1559b184848a1d53dee60fcf2c522110e5a081" in the field. Click "Buy". You should see a legend saying that 'You can buy here' because it's antonio's address. Write 1 in the amount field and click "Pay". Children and shop balances have been updated.
9. On child's wallet DApp, try the 'Can buy?' functionality writing "0x3e7e856858ef5c777874f2f4055af76f7f6d75b0" (a non allowed address). You should see a legend saying that 'You can not buy here'.
10. On child's wallet DApp, add "bad" as address and see that "ERROR: Invalid address" text appear. It's validating address' format.

