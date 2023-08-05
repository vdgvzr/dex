# DEX

This project is for demonstative purposes only. Project is hosted [Here](https://dex-snowy.vercel.app/),
and is currently deployed only to Sepolia testnet.

## Details

- **Backend framework used** Solidity
- **Frontend framework used** Vite - React + SWC

## Host

[Vercel](https://dex-snowy.vercel.app/)

## Chains deployed

|             | Development | Staging | Live     |
| ----------- | ----------- | ------- | -------- |
| **Mainnet** | N/A         | N/A     | N/A      |
| **Sepolia** | N/A         | N/A     | Deployed |
| **Goerli**  | N/A         | N/A     | N/A      |

## File structure

```
|-- ./
|-- abis
|-- contracts
|-- dist
|-- src
    |-- main.jsx
|-- test
```

## Development process

1. Clone the repository at [https://github.com/vdgvzr/dex.git](https://github.com/vdgvzr/dex.git).
2. Create a new `.env` file following the example.
3. Create a new `secret.json` file following the example.
4. Run `npm i` to install frontend libraries.
5. Run `npm run build` to build transpiled frontend assets.
6. Run `npm run dev` to start development server.
