# The Backend

## Technology

This is the backend api and socket based "brain" of this project.

The backend api runs of off express.
The socket part runs on socket.io

Both run on the SAME port.

## Security

This app is protected with heroku’s basic firewall, helmet, rate limits, and most importantly, my authentication layer.

## Authentication

The authentication for if a user is logged in or has admin privileges is handled by JWT, or json web tokens.

For example, to access an api route that is private, you must pass in a valid auth-token (in the jwt) in the auth-token header.

To even connect to my socket.io server, you must immediately pass in your valid auth token in the query auth-token property

## Data

Every mongoose "model" is stored in the models folder.

There are 3 collections, one for storing users, one for storing leaks, and one for storing contact info (your phones identification id).

Every leak is tied to the user that owns it, through a field called uid (user id).

Every time a leak is added, the backend searches for your phone’s id (explained above), and sends a notification. It will also send a socket notification (in case notifications are disabled, or for a web app)

To keep the apps data in check (i.e., connection goes out), the database will occasionally send a socket event to the app with the data it needs.

## _.env specifications_

DB_CONNECT is the connection uri to mongodb

PORT is the port to run the dual server on

ACCESS_TOKEN_SECRET is the encryption private used to create and verify json web tokens.

interval_ms is how often the clients get a "just in case" refresh of their data (in milliseconds)

dev is a value if the project is in development or not. This determines if various production middleware should be added.
Only the text dev=true sets the project to development. If that is not entered or it is left blank, the project will run in production.

## **EXAMPLE .env**

```
DB_CONNECT=mongodb+srv://url_location/db_name?retryWrites=true&w=majority
PORT=4201
ACCESS_TOKEN_SECRET=EncryptionPrivateKey
interval_ms=6000
dev=true
```
