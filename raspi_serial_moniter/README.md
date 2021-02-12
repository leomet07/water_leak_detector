# Serial moniter

This is the 24/7 monitering script that recieves the arduinos passed on analog sensor data and sends it to my backend (api).

## _.env specifications_

linuxport is the linux serial location of the arduino (type) device plugged in (/dev/....)

win32port is the windows serial location of the arduino (type) device plugged in (COM...)

auth-token is the auth token recieved from my backend, through the /api/auth/login/ route.

## **EXAMPLE .env**

```
linuxport=/dev/ttyUSB0

win32port=COM4

auth-token=**auth-token**
```
