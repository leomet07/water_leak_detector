# The Mobile app

This apponly asks if permissions have not already been determined, because
iOS won't necessarily prompt the user a second time.
On Android, permissions are granted on app installation, so
`askAsync` will never prompt the user.
