// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module mynft::testnet_nft;

use std::string::String;
use sui::event;
use sui::package;
use sui::display;


/// An example NFT that can be minted by anybody
public struct TestnetNFT has key, store {
    id: UID,
    /// Name for the token
    name: String,
    /// Description of the token
    description: String,
    /// URL for the token
    url: String,
    // TODO: allow custom attributes
}

// ===== Events =====

public struct NFTMinted has copy, drop {
    // The Object ID of the NFT
    nft_id: ID,
    // The creator of the NFT
    creator: address,
    // The name of the NFT
    name: String,
}
//==One Time Witness
public struct TESTNET_NFT has drop{}

fun init(otw: TESTNET_NFT, ctx: &mut TxContext){
    let publisher = package::claim(otw, ctx);

    let mut display = display::new<TestnetNFT>(&publisher, ctx);
    display.add(b"Name".to_string(), b"{name}".to_string());
    display.add(b"Description".to_string(), b"{description}".to_string());
    display.add(b"Image_url".to_string(), b"{url}".to_string());
    display.update_version();


    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender())
    
}



#[allow(lint(self_transfer))]
/// Create a new nft
public fun mint_to_sender(
    name: String,
    description: String,
    url: String,
    ctx: &mut TxContext,
) {
    
    let nft = TestnetNFT {
        id: object::new(ctx),
        name,
        description,
        url
    };

    event::emit(NFTMinted {
        nft_id: object::id(&nft),
        creator: ctx.sender(),
        name: nft.name
    });

    transfer::public_transfer(nft, ctx.sender());
}

/// Transfer `nft` to `recipient`
public fun transfer(nft: TestnetNFT, recipient: address) {
    transfer::public_transfer(nft, recipient)
}

/// Update the `description` of `nft` to `new_description`
public fun update_description(
    nft: &mut TestnetNFT,
    new_description: String,
    
) {
    nft.description = new_description
}

/// Permanently delete `nft`
public fun burn(nft: TestnetNFT) {
    let TestnetNFT { id, name: _, description: _, url: _ } = nft;
    id.delete()
}

// ===== Public view functions =====

/// Get the NFT's `name`
public fun name(nft: &TestnetNFT): String {
    nft.name
}

/// Get the NFT's `description`
public fun description(nft: &TestnetNFT): String {
    nft.description
}

/// Get the NFT's `url`
public fun url(nft: &TestnetNFT): String {
    nft.url
}