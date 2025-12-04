## myNFT — NFT Minting and Marketplace on Sui

myNFT is a simple NFT minting and marketplace application built on the Sui blockchain.
It is designed for a 2-day technical workshop, so the explanations are clear and beginner-friendly.

The project showcases how to:

1. Upload NFT media using Walrus decentralized storage

2. Mint NFTs using Sui Move smart contracts

3. List and purchase NFTs through a basic marketplace

4. Build a dApp using Vite + TypeScript as the frontend

## Overview

Frontend: Vite + TypeScript 
Smart Contracts: Sui Move 
Storage: Walrus (for media and metadata storage)

## Features
Minting

Upload images or files to Walrus

Generate NFT metadata

Mint NFTs on the Sui blockchain

Marketplace

List NFTs for sale

Buy NFTs with SUI tokens

Transfer ownership automatically

Wallet Integration

Connect a Sui wallet

Sign and send transactions

View owned NFTs

## Prerequisites
Before getting started, ensure you have:

Node.js (version 18+)

npm, yarn, or pnpm

Sui CLI installed and configured

Walrus CLI or SDK access

A Sui wallet (such as Slush, Ethos or Suiet)

## Setup
1. Clone the repository
'''bash
git clone https://github.com/CipherG7/myNFT
cd myNFT
'''

3. Install frontend dependencies
cd frontend
npm install
npm run dev

4. Build and publish the Move contracts
cd contracts
sui move build
sui client publish


Save the published package ID and update the frontend configuration.

4. Mint an NFT

Using the frontend:

Upload media (Walrus blob ID)

Fill in metadata

Mint the NFT through the connected wallet

Workshop Goals

By the end of the workshop, participants should understand:

How Move modules work on Sui

How to deploy and interact with smart contracts

How Walrus stores files in a decentralized way

How to build a basic dApp using Vite + TypeScript

The complete workflow of minting and listing NFTs

This dApp was created using `@mysten/create-dapp` that sets up a basic React
Client dApp using the following tools:

- [React](https://react.dev/) as the UI framework
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [Vite](https://vitejs.dev/) for build tooling
- [Radix UI](https://www.radix-ui.com/) for pre-built UI components
- [ESLint](https://eslint.org/)
- [`@mysten/dapp-kit`](https://sdk.mystenlabs.com/dapp-kit) for connecting to
  wallets and loading data
- [pnpm](https://pnpm.io/) for package management

## Starting your dApp

To install dependencies you can run

```bash
pnpm install
```

To start your dApp in development mode run

```bash
pnpm dev
```

## Building

To build your app for deployment you can run

```bash
pnpm build
```
