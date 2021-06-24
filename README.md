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

### Frontend

The frontend of this project is a [Vite](https://github.com/vitejs/vite) project which leans on [the element framework](https://github.com/element-plus/element-plus) for some basic style and component support (at the time of creation, it seemed to be the most robust vue3-compatible library. As support for vuetify becomes more robust, we may make the switch).

To start the frontend dev server:

```sh
cd frontend
yarn install
yarn dev
```

### Backend

The backend is used for deck storage and sharing, and isn't required if you're only working on card search. But, if you _are_ working on deck-building functionality:

```sh
cd frontend # I know, this is confusing
```

Then, start the firebase emulators:
```sh
firebase emulators:start
```

note: occasionally, killing the process will leave the port taken (at least on windows):
```sh
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess
taskkill /PID (PIC from last step) /F
```
