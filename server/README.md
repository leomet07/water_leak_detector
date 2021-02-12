# The Backend

## Technology

This is the backend api and socket based "brain" of this project.

The backend api runs of off express.
The socket part runs on socket.io

Both run on the SAME port.

## Security

This app is protected with herokus basic firewall, helmet, rate limits, and most importantly, my authentication layer.

## Authentication

The authentication for if a user is logged in or has admin privledges is handled by JWT, or json web tokens.

For example, to acecss an api route that is private, you must pass in a valid auth-token (in the jwt) in the auth-token header.

To even connect to my socket.io server, you must immediately pass in your valid auth token in the query auth-token property

## Data

Every mongoose "model" is stored in the models folder.

There are 3 collections, one for storing users, one for storing leaks, and one for storing contact info (your phones identification id).

Every leak is tied to the user that owns it, through a field called uid (user id).

Every time a leak is added, the backend searches for your phones id (explained above), and sends a notification. It will also send a socket notifiction (in case notifications are disabled, or for a web app)

To keep the apps data in check (if wifi goes out), the database will occasionally send a socket event to the app with the data it needs.
