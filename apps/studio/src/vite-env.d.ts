/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_APP_VARIANT: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_IMAGE_DATA_SCRIPT_URI: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
