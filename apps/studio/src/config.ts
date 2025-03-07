export type AppVariant = 'nouns' | 'lil-nouns';
import { ComponentType } from 'react';
import lilNounsConfig from './variants/lil-nouns/config';
import nounsConfig from './variants/nouns/config';

export interface AppConfig {
    variant: AppVariant;
    subgraphUri?: string;
    galleryUrl?: string;
    imageDataScriptUri: string;
    appTitle: string;
    Logo: ComponentType;
}

export const appConfig = import.meta.env.VITE_APP_VARIANT === 'lil-nouns' ? lilNounsConfig : nounsConfig;