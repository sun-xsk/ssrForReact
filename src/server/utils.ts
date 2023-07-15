/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ViteDevServer } from "vite";
import path from 'path';

export const cwd = process.cwd();
export const isProd = process.env.NODE_ENV === 'production';

export function loadSsrEntryModul(vite: ViteDevServer | null) {
    if (isProd) {
        const entryPath = path.join(cwd, 'dist/server/entry-server.js')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return require(entryPath);
    } else {
        const entryPath = path.join(cwd, 'src/entry-server.tsx')
        return vite!.ssrLoadModule(entryPath)

export function resolveTemplatePath() {
    return isProd ? 
    path.join(cwd,'dist/server/index.html') : 
    path.join(cwd,'index.html')
}

export function mathPageUrl(url:string){
    if(url === '/'){
        return true
    }
}

