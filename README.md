# Contributing

## Requirments

[yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

[firebase emulator suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)

[nvm](https://github.com/nvm-sh/nvm) (or a system version of node compatible with the version in the [.nvmrc](./.nvmrc))

Then, from this directory: 
```
nvm use
```

## Backend

(start this first, it doesn't handle ports as well)
```
firebase emulators:start
```

occasionally, killing the process will leave the port taken:
```
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess
taskkill /PID (PIC from last step) /F
```
