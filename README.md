# [Blood.cards](https://blood.cards)

A _Flesh and Blood_ card browser and deck builder.

## Contributing

### Requirments

[yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

[firebase emulator suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)

[nvm](https://github.com/nvm-sh/nvm) (or a system version of node compatible with the version in the [.nvmrc](./.nvmrc))

Then, from this directory: 
```
nvm use
```

### Backend

The backend is used for deck storage and sharing, and isn't required if you're only working on card search. If you are working on deck-building functionality:

(start this first, it doesn't handle ports as well)
```
firebase emulators:start
```

occasionally, killing the process will leave the port taken:
```
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess
taskkill /PID (PIC from last step) /F
```
