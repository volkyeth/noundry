export type AppVariant = 'nouns' | 'lil-nouns';
import { NounSeed } from 'noggles';
import { ComponentType } from 'react';
import { PublicClient } from 'viem';
import lilNounsConfig from './variants/lil-nouns/config';
import nounsConfig from './variants/nouns/config';

export interface AppConfig {
    variant: AppVariant;
    subgraphUri?: string;
    galleryUrl?: string;
    imageDataScriptUri: string;
    appTitle: string;
    Logo: ComponentType;
    nounTerm: string;
    fetchLatestNounId?: (publicClient: PublicClient) => Promise<bigint>;
    fetchNounSeed?: (publicClient: PublicClient, nounId: number) => Promise<NounSeed>;
}

export const appConfig = import.meta.env.VITE_APP_VARIANT === 'lil-nouns' ? lilNounsConfig : nounsConfig;