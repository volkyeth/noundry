import { AppConfig, AppVariant } from '../../config';
import Logo from "./assets/noundry-studio.svg?react";

export const nounsConfig: AppConfig = {
    variant: 'nouns' as AppVariant,
    subgraphUri: 'https://www.nouns.camp/subgraphs/nouns',
    galleryUrl: 'https://gallery.noundry.wtf',
    imageDataScriptUri: 'https://assets.noundry.wtf/nouns/image-data.js',
    appTitle: 'Noundry Studio',
    Logo
};

export default nounsConfig; 