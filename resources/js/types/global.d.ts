import type { Auth } from './auth';

declare module '@inertiajs/core' {
    interface PageProps {
        auth: Auth;
        debug?: boolean;
        mustVerifyEmail?: boolean;
        status?: string;
    }
}

// Extend ImportMeta interface for Vite...
declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        [key: string]: string | boolean | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
        readonly glob: <T>(pattern: string) => Record<string, () => Promise<T>>;
    }
}
