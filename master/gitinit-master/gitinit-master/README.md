# gitinit
> Create a new project based on an already existing repository

## Install
```
npm i -g gitinit
```

## Usage

Run `gitinit` followed by the repo url that is to be used as the basis of the new project. The program will go on to ask where to create the new project `<username>/<repo>`. Confirm this operation by entering a `<password>`; required so that the script can create the new repo on behalf of `<username>` via CURL.

```
gitinit electron/electron-quick-start

> into: lukejacksonn/neutron
> pass: •••••••••••••••••

Initialized lukejacksonn/neutron from electron/electron-quick-start
```

This procedure will create the folder `./neutron` in the directory where the the command was ran, it will also have created the repository `lukejacksonn/neutron` on github. Both the local and remote clone contain a snapshot of `electron/electron-quick-start` with all git history squashed into an initial commit with the message `Gitinit electron/electron-quick-start`.

## Procedure

Essentially the script runs the following commands:

- Creates a new empty repository
- Clones the basis repository
- Removes the git history of the cloned repo
- Reinitializes clone as a git repo
- Makes an initial commit in the clone
- Pushes the cleaned clone to the new repo

The code for these steps can be found in [index.js](index.js)
