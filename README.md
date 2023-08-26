# Blockchain Terminal UI

## Tech:

#### Project:

- yarn
- create-react-app
- customize-cra
- jest
- eslint

#### App:

- react
- mobx
- styled-components
- material-ui
- recompose

## Basic Dev Setup:

1. Clone the repo
2. Add `127.0.0.1   dev.bct.trade` to `/etc/hosts`
3. To build and run inside docker (easy, slow): install docker, run `./dev.sh`
4. Otherwise: install `yarn`
5. Run `sudo HOST=dev.bct.trade HTTPS=true PORT=443 yarn start` (or set these env variables another way). It may be possible to use other ports, but you may have issues with server connectivity.
6. Launch the app: `yarn start` (it may take 1-2 minutes to build the app)
7. If yarn complains about missing packages (e.g. customize-cra), install them using `yarn add package-name` - do not use npm install to add the packages
8. When switching between yarn build and docker build: delete `node_modules` folder and `package-lock.json` (if present)

When you open https://dev.bct.trade/ in your browser - it will notify you, that the certificate is self-signed and authority could be checked - just add exception.

## Tests

#### Unit tests

- Add tests to `src/__tests__/unit`
- Execute tests `yarn test:unit`

#### Integration tests

- Add tests to `src/__tests__/integration`
- Launch the app with "coverage" flag `yarn start:coverage`
- Execute tests `yarn test:integration`

## Contributing

https://gitlab.com/cryptoems/blockchain-terminal-ui/wikis/Branching-Flow
