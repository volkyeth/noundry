import { nounsTokenContract } from 'noggles';
import { AppConfig, ThemeColors } from '../config';
import LogoImage from "./assets/NoundryGalleryLogo.svg";
import LoadingNoggles from "./assets/loading-noggles.svg";
import loadingNoun from "./assets/loading-noun.gif";
import favicon from "./assets/favicon.png";

// Nouns theme colors
const theme: ThemeColors = {
    primary: {
        DEFAULT: '#ff2165',
        50: '#fff0f5',
        100: '#ffd3e0',
        200: '#ffa6c1',
        300: '#ff7aa3',
        400: '#ff4d84',
        500: '#ff2165',
        600: '#cc1a51',
        700: '#99143d',
        800: '#660d28',
        900: '#330714',
    }
};

const nounsConfig: AppConfig = {
    variant: 'nouns',
    appTitle: 'Noundry Gallery',
    LogoImage,
    LoadingNoggles,
    loadingNoun,
    favicon,
    nounTerm: 'Noun',
    nounTermPlural: 'Nouns',
    daoName: 'Nouns DAO',
    socialLinks: {
        discord: 'https://discord.gg/XbYPDSKVaV',
        twitter: 'https://twitter.com/noundry',
        farcaster: 'https://warpcast.com/noundry',
    },
    studioUrl: 'https://studio.noundry.wtf',
    studioName: 'Noundry Studio',

    traitUpdatesEnabled: true,

    // Theme configuration
    theme,

    // Database config
    databaseName: 'gallery',

    // API endpoints
    artworkDataUrl: 'https://assets.noundry.wtf/nouns/art-data.json',

    // Contract information
    descriptorContract: nounsTokenContract,

    // Feature flags
    hasProposalCandidates: true,

    // URLs
    mainSiteUrl: 'https://nouns.wtf',
    discordUrl: 'https://discord.gg/XbYPDSKVaV',
    twitterUrl: 'https://twitter.com/noundry',
    farcasterUrl: 'https://warpcast.com/noundry',
    githubUrl: 'https://github.com/volkyeth/noundry',
};

export default nounsConfig; 