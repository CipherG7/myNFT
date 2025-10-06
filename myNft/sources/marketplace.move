module mynft::marketplace;

use sui::bag::{Self, Bag};
use sui::coin::Coin;
use sui::dynamic_object_field as dof;
use sui::table::{Self, Table};
use mynft::testnet_nft::{TestnetNFT};
use sui::sui::SUI;


const EAmountIncorrect: u64 = 0;
const ENotOwner: u64 = 1;

public struct Marketplace<phantom SUI> has key {
    id: UID,
    items: Bag,
    payments: Table<address, Coin<SUI>>,
}

public struct Listing has key, store {
    id: UID,
    price: u64,
    owner: address,
}


public fun create_marketplace<SUI>(ctx: &mut TxContext){
    let marketplace = Marketplace<SUI> {
        id: object::new(ctx),
        items: bag::new(ctx),
        payments: table::new(ctx)
    };
    transfer::share_object(marketplace)

}

public fun list(
    marketplace: &mut Marketplace<SUI>,
    nft: TestnetNFT,
    price: u64,
    ctx: &mut TxContext,
) {
    let nft_id = object::id(&nft);
    let mut listing = Listing {
        price,
        id: object::new(ctx),
        owner: ctx.sender(),
    };

    dof::add(&mut listing.id, true, nft);
    marketplace.items.add(nft_id, listing)
}

fun delist(
    marketplace: &mut Marketplace<SUI>,
    nft_id: ID,
    ctx: &TxContext
): TestnetNFT {
    let Listing { mut id, owner, .. } = bag::remove(
        &mut marketplace.items,
        nft_id,
    );

    assert!(ctx.sender() == owner, ENotOwner);

    let nft = dof::remove(&mut id, true);
    id.delete();
    nft
}

#[allow(lint(self_transfer))]
public fun delist_and_take(
    marketplace: &mut Marketplace<SUI>,
    nft_id: ID,
    ctx: &mut TxContext,
) {
    let nft = delist(marketplace, nft_id, ctx);
    transfer::public_transfer(nft, ctx.sender());
}

fun buy(
    marketplace: &mut Marketplace<SUI>,
    nft_id: ID,
    paid: Coin<SUI>,
): TestnetNFT {
    let Listing {
        mut id,
        price,
        owner,
    } = marketplace.items.remove(nft_id);

    assert!(price == paid.value(), EAmountIncorrect);

    if (marketplace.payments.contains(owner)) {
        marketplace.payments.borrow_mut(owner).join(paid)
    } else {
        marketplace.payments.add(owner, paid)
    };

    let nft = dof::remove(&mut id, true);
    id.delete();
    nft
}

#[allow(lint(self_transfer))]
public fun buy_and_take(
    marketplace: &mut Marketplace<SUI>,
    nft_id: ID,
    paid: Coin<SUI>,
    ctx: &mut TxContext,
) {
    transfer::public_transfer(
        buy(marketplace, nft_id, paid),
        ctx.sender(),
    )
}

fun take_profits(
    marketplace: &mut Marketplace<SUI>,
    ctx: &TxContext,
): Coin<SUI> {
    marketplace.payments.remove(ctx.sender())
}

#[lint_allow(self_transfer)]
public fun take_profits_and_keep(
    marketplace: &mut Marketplace<SUI>,
    ctx: &mut TxContext,
) {
    transfer::public_transfer(
        take_profits(marketplace, ctx),
        ctx.sender(),
    )
}
