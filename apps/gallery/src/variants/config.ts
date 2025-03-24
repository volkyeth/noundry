export type AppVariant = 'nouns' | 'lil-nouns';

import { StaticImageData } from 'next/image';
import { FC, SVGProps } from 'react';
import { Abi, Address } from 'viem';
import lilNounsConfig from './lil-nouns/config';
import nounsConfig from './nouns/config';

export interface ThemeColors {
    primary: {
        DEFAULT: string;
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        950?: string;
    };
}

export interface AppConfig {
    variant: AppVariant;
    appTitle: string;
    LogoImage: FC<SVGProps<SVGElement>>;
    LoadingNoggles: FC<SVGProps<SVGElement>>;
    loadingNoun: StaticImageData;
    nounTerm: string;
    favicon: StaticImageData;
    nounTermPlural: string;
    nounTermShortPlural: string;
    daoName: string;
    socialLinks: {
        discord?: string;
        twitter?: string;
        farcaster?: string;
    };
    studioUrl: string;
    studioName: string;
    traitUpdatesEnabled: boolean;

    // Theme configuration
    theme: ThemeColors;

    // Database config
    databaseName: string;

    // API endpoints
    artworkDataUrl: string;

    // Contract information
    descriptorContract: {
        address: Address;
        abi: Abi;
    };

    // Feature flags
    hasProposalCandidates: boolean;

    // URLs
    mainSiteUrl: string;
    discordUrl: string;
    twitterUrl: string;
    farcasterUrl: string;
    githubUrl: string;
}

// Default to 'nouns' if not specified
const variantFromEnv = process.env.NEXT_PUBLIC_APP_VARIANT as AppVariant || 'nouns';
export const appConfig = variantFromEnv === 'lil-nouns' ? lilNounsConfig : nounsConfig; 