# demo-site-with-ravencoin-authentication

A minimalistic web site that uses Ravencoin NFTs for authentication

# GETTING STARTED

## Clone the repo from github

`git clone https://github.com/ravenrebels/demo-site-with-ravencoin-authentication.git`

## Build project

`npm install`

## Run locally

`node server`

open [http://localhost](http://localhost)

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
  orderRef: 'aaff69ac-6070-4c0e-bf19-7f9d0854293a',
  endUserIp: '127.0.0.1',
  userVisibleData: 'RGF0ZTogMjAyMi0wOC0zMFQwNzowMjoyMS45ODFaIFNpZ24gaW4gdG8gc3VwZXIgd2ViIHNpdGUgZG90IGNvbQ==',
  hintCode: 'outstandingTransaction',
  createdDate: '2022-08-30T07:02:27.750Z'
}
```

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
