export class SupportedChain {
  static ETH = {
    id: 1,
    idHex: '0x1',
    name: 'Ethereum',
    confirmationBlock: 12,
    explorer: 'https://etherscan.io',
    nativeCurrency: 'ETH',
  };

  static BSC = {
    id: 56,
    idHex: '0x38',
    name: 'BSC',
    confirmationBlock: 18,
    explorer: 'https://bscscan.com',
    nativeCurrency: 'BNB',
  };

  static POLYGON = {
    id: 137,
    idHex: '0x89',
    name: 'Polygon',
    confirmationBlock: 50,
    explorer: 'https://polygonscan.com',
    nativeCurrency: 'MATIC',
  };

  static AVALANCHE = {
    id: 43114,
    idHex: '0xa86a',
    name: 'Avalanche',
    confirmationBlock: 50,
    explorer: 'https://snowtrace.io',
    nativeCurrency: 'AVAX',
  };

  static ARBITRUM = {
    id: 42161,
    idHex: '0xa4b1',
    name: 'Arbitrum',
    confirmationBlock: 50,
    explorer: 'https://arbiscan.io',
    nativeCurrency: 'ETH',
  };

  static BASE = {
    id: 8453,
    idHex: '0x2105',
    name: 'Base',
    confirmationBlock: 50,
    explorer: 'https://basescan.org/',
    nativeCurrency: 'BASE',
  };

  static MANTLE = {
    id: 5000,
    idHex: '0x1388',
    name: 'Mantle',
    confirmationBlock: 50,
    explorer: 'https://explorer.mantle.xyz',
    nativeCurrency: 'MNT',
  };

  static FANTOM = {
    id: 250,
    idHex: '0xfa',
    name: 'Fantom',
    confirmationBlock: 50,
    explorer: 'https://ftmscan.com',
    nativeCurrency: 'FTM',
  };

  static OPTIMISM = {
    id: 10,
    idHex: '0xa',
    name: 'Optimism',
    confirmationBlock: 50,
    explorer: 'https://optimistic.etherscan.io',
    nativeCurrency: 'ETH',
  };

  static GNOSIS = {
    id: 100,
    idHex: '0x64',
    name: 'Gnosis',
    confirmationBlock: 50,
    explorer: 'https://gnosisscan.io',
    nativeCurrency: 'xDAI',
  };
}
