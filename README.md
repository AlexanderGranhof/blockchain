# Blockchain

## Resources
- https://hackernoon.com/learn-blockchains-by-building-one-117428612f46
- https://github.com/dvf/blockchain/blob/master/blockchain.py
- https://blog.goodaudience.com/blockchain-for-beginners-what-is-blockchain-519db8c6677a
- https://www.investopedia.com/terms/b/blockchain.asp
- https://www.upgrad.com/blog/cryptography-in-blockchain/

## How to run
1. have `docker` and `docker-compose` installed
2. `docker-compose up`
3. app is now running on [http://localhost:3000](http://localhost:3000)

## How to interact
- GET `/chain` to see the whole chain
- POST `/createTransaction`  with `sender, recipient, amount` and body json parameters to create a transaction
- GET `/mine` to simulate mining and generate the proof for the new block
- POST `/createBlock` with the proof as a text to generate the new block
- GET `/register_node` to register as a node, this does not do anything at the moment