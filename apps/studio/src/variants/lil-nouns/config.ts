import { fetchLatestLilNounId, fetchLilNounSeed } from 'noggles';
import { AppConfig, AppVariant } from '../../config';
import Logo from "./assets/lil-studio.svg?react";

export const lilNounsConfig: AppConfig = {
    variant: 'lil-nouns' as AppVariant,
    galleryUrl: import.meta.env.VITE_GALLERY_URL || 'https://lil.noundry.wtf',
    imageDataScriptUri: 'https://assets.noundry.wtf/lil-nouns/image-data.js',
    appTitle: 'Lil Studio',
    Logo,
    nounTerm: 'Lil',
    fetchLatestNounId: fetchLatestLilNounId,
    fetchNounSeed: fetchLilNounSeed
};

export default lilNounsConfig; 