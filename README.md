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
    "completionData": {
        "user": {
            "personalNumber": "FREN#WONDERLAND",
            "name": "FREN#WONDERLAND",
            "givenName": "R9ViFY6HbQqz5N8h159g7PFGNymN6khaRU",
            "surname": "FREN#WONDERLAND"
        },
        "device": {
            "ipAddress": "::ffff:172.16.48.78"
        },
        "cert": {
            "notBefore": "1660638691933",
            "notAfter": "5980638817306"
        },
        "signature": "H0mJY/c29PHTXtQuirp5t2Nt30T34zQFUGz8uw+nuHiRfcZteiPLQKaNmliVWJ2n3Gy/bUUIhVelYp3yyLnKhbM=",
        "address": "R9ViFY6HbQqz5N8h159g7PFGNymN6khaRU",
        "nft": "FREN#WONDERLAND",
        "ocspResponse": ""
    },
    "userVisibleData": "U2lnbiBpbiB3aXRoIFJhdmVuY29pbiBORlQgZGVtbyBzaXRlIDIwMjItMDktMTBUMTM6NTE6MzEuODMzWg==",
    "orderRef": "77eb0ceb-9b26-4983-be97-26ea8a5de97f",
    "hintCode": "",
    "status": "complete"
}
```

### STEP 3

When the order is complete (status==="complete") we welcome the user.

The web site stores the user information (in the user session), because the authentication order over at idp.ravenrebels.com will be deleted within minutes.
