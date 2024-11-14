/// <reference types="vite/client" />

declare const custom: {
    env: Record<string, any>;
};

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}