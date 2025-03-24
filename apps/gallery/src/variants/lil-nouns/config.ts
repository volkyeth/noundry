import { AppConfig, ThemeColors } from '../config';
import favicon from "./assets/favicon.png";
import LogoImage from "./assets/lil-noundry.svg";
import loadingNoun from "./assets/loading-lil-noun.gif";
import LoadingNoggles from "./assets/loading-noggles.svg";
// We'll need to create or import the Lil Nouns token contract
// For now, creating a placeholder for the Lil Nouns token contract
import { nounsTokenContract } from 'noggles';
import { Address } from 'viem';

// This is a placeholder for the Lil Nouns token contract
// This should be properly defined in the noggles package or elsewhere
const lilNounsTokenContract = {
    address: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B' as Address, // Lil Nouns token contract address
    abi: nounsTokenContract.abi, // Using Nouns ABI as placeholder, replace with actual Lil Nouns ABI
};

// Lil Nouns theme colors
const theme: ThemeColors = {
    primary: {
        DEFAULT: '#1e92d9',
        50: '#f1f8fe',
        100: '#e2f0fc',
        200: '#bfe1f8',
        300: '#7cc4f2',
        400: '#46adea',
        500: '#1e92d9',
        600: '#1075b9',
        700: '#0e5d96',
        800: '#104f7c',
        900: '#134267',
        950: '#0d2a44',
    }
};

const lilNounsConfig: AppConfig = {
    variant: 'lil-nouns',
    appTitle: 'Lil Noundry',
    LogoImage,
    LoadingNoggles,
    loadingNoun,
    favicon,
    nounTerm: 'Lil Noun',
    nounTermPlural: 'Lil Nouns',
    nounTermShortPlural: 'Lils',
    daoName: 'Lil Nouns DAO',
    socialLinks: {
        discord: 'https://discord.gg/QdvWkSSWcB',
    },
    studioName: 'Lil Studio',
    studioUrl: 'https://lil-studio.noundry.wtf',
    traitUpdatesEnabled: false,

    // Theme configuration
    theme,

    // Database config
    databaseName: 'lil-gallery',

    // API endpoints
    artworkDataUrl: 'https://assets.noundry.wtf/lil-nouns/art-data.json',

    // Contract information
    descriptorContract: lilNounsTokenContract,

    // Feature flags
    hasProposalCandidates: false, // Lil Nouns doesn't have proposal candidates

    // URLs
    mainSiteUrl: 'https://lilnouns.wtf',
    discordUrl: 'https://discord.gg/XbYPDSKVaV', // Using same Discord for now
    twitterUrl: 'https://twitter.com/noundry', // Using same Twitter for now
    farcasterUrl: 'https://warpcast.com/noundry', // Using same Farcaster for now
    githubUrl: 'https://github.com/volkyeth/noundry', // Using same GitHub for now
};

export default lilNounsConfig; 