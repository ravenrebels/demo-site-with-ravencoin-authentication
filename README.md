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

Currently our only server is
`https://infinite-gorge-31721.herokuapp.com`

### STEP 1

Relying Party (RP) creates an authentication "order"

- `endUserIp` is the IP address of the end user
- `@userVisibleData` is the text message that the end user will sign, base64 encoded

The request

```
POST /rp/v5.1/sign HTTP/1.1
Content-Type: application/json
Host: appapi2.bankid.com
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

RP starts polling status

Request

```
POST /rp/v5.1/collect HTTP/1.1
Content-Type: application/json
Host: appapi2.bankid.com
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
            "personalNumber": "FREN#REBELLIOUS-RED",
            "name": "FREN#REBELLIOUS-RED",
            "givenName": "RS4EYELZhxMtDAuyrQimVrcSnaeaLCXeo6",
            "surname": "FREN#REBELLIOUS-RED"
        },
        "device": {
            "ipAddress": "::ffff:172.17.66.130"
        },
        "cert": {
            "notBefore": "1660638691933",
            "notAfter": "5980638817306"
        },
        "signature": "INtEACFiqaF7qmGgFiFsnVFvA47NmBelyIh6tX4E7wIsP5CUfqQ/a0Y4GgyDXGGBwJx9+jZD8KZGwNds3YRPhmg=",
        "ocspResponse": ""
    },
    "orderRef": "08e2921a-055c-41d6-8196-c681720f62e0",
    "hintCode": "",
    "status": "complete"
}
```
