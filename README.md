# demo-site-with-ravencoin-authentication

A minimalistic web site that uses Ravencoin NFTs for authentication

You can try out this demo online https://demo-ravencoin-webapp.herokuapp.com/

## How it works
Just three steps, create the authentication order, pull/poll the status of the order, say hello to the user. That's it.
- The web sites requests a authentication order from the Identity Provider (idp.ravenrebels.com) and get `orderRef`(id) and `endUserURL` back
- The web sites opens `endUserURL` in a new window/tab so that the end user can fill out the authentication form.
- The web site starts pulling status and when status is "complete" the response contains nft (Unique Asset), address and signature.


# GETTING STARTED

## Clone the repo from github

`git clone https://github.com/ravenrebels/demo-site-with-ravencoin-authentication.git`

## Build project

`npm install`

## Run locally

`node server`



 

## How it works technically

This demo web site will authenticate using an Identity Provider called idp.ravenrebels.com.

### STEP 1

The web site creates an authentication "order" using HTTP Post with JSON data.

- `endUserIp` is the IP address of the end user
- `@userVisibleData` is the text message that the end user will sign, base64 encoded

The request

```
POST /rp/v5.1/sign HTTP/1.1
Content-Type: application/json
Host: idp.ravenrebels.com
{
  endUserIp: '127.0.0.1',
  userVisibleData: 'RGF0ZTogMjAyMi0wOC0zMFQwNzowMjoyMS45ODFaIFNpZ24gaW4gdG8gc3VwZXIgd2ViIHNpdGUgZG90IGNvbQ=='
}
```


The response

```
 {
  orderRef: '7776abab-f16c-4491-8e82-45acccf8c247',
  endUserIp: '127.0.0.1',
  endUserURL: 'https://idp.ravenrebels.com?orderRef=7776abab-f16c-4491-8e82-45acccf8c247',
  userVisibleData: 'RGF0ZTogMjAyMi0wOS0xMlQwNjo1NjoxOC4wMTlaIFNpZ24gaW4gdG8gc3VwZXIgd2ViIHNpdGUgZG90IGNvbQ==',
  hintCode: 'outstandingTransaction',
  createdDate: '2022-09-12T06:56:19.356Z'
}
```
 
The web site opens `endUserURL` in a new window or tab so that the end user can authenticate.

### STEP 2

The demo web site (Relying Party) starts polling status every 2 seconds

Request

```
POST /rp/v5.1/collect HTTP/1.1
Content-Type: application/json
Host: idp.ravenrebels.com
{
  "orderRef":"131daac9-16c6-4618-beb0-365768f37288"
}
```

Response while status is "pending"

```
{
    "orderRef": "08e2921a-055c-41d6-8196-c681720f62e0",
    "hintCode": "started",
    "status": "pending"
}
```

Response when status "complete"

```
{
    "orderRef": "1aff0200-f300-4083-8740-d7a3472684b5",
    "endUserIp": "127.0.0.1",
    "endUserURL": "https: //idp.ravenrebels.com?orderRef=1aff0200-f300-4083-8740-d7a3472684b5",
    "userVisibleData": "U2lnbiBpbiB3aXRoIFJhdmVuY29pbiBORlQgZGVtbyBzaXRlIDIwMjItMDktMTNUMDk6Mjc6MDMuMjMwWg==",
    "hintCode": "outstandingTransaction",
    "createdDate": "2022-09-13T09: 27: 04.377Z",
    "userResponse": {
      "address": "R9ViFY6HbQqz5N8h159g7PFGNymN6khaRU",
      "message": "Sign in with Ravencoin NFT demo site 2022-09-13T09: 27: 03.230Z",
      "nft": "FREN#WONDERLAND",
      "orderRef": "1aff0200-f300-4083-8740-d7a3472684b5",
      "signature": "HxROA5Dvu/cdgXAYte5n4NA7t59sE7BR7BnkX6Y1LZ6iQU8/fld/Mnjm3eF3QD0hkkqXSvEfqB67mhOtshM4CRA=",
      "ipAddress": { "address": ": :ffff: 172.19.65.134", "family": "IPv6", "port": 26850
    }
  },
    "status": "complete",
    "meta": {
      "sats_in_circulation": 100000000,
      "divisions": 0,
      "reissuable": false,
      "has_ipfs": true,
      "ipfs": "QmPdwHENQ4jvDEsxNqQfSo9jXfwYuysDvcY4dWQFX6fn8K",
      "source": {
        "tx_hash": "d6b5536e17629937c520c3aabab6f0b2cd79b578c7f13ddf26a9ddd3d4673a90",
        "tx_pos": 3,
        "height": 2400319
    }
  }
}
```

### STEP 3

When the order is complete (status==="complete") we welcome the user.

The web site stores the user information (in the user session), because the authentication order over at idp.ravenrebels.com will be deleted within minutes.
