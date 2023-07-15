/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { RequestHandler, Express } from 'express'
import fs from 'fs'
import React from 'react';
import { renderToString } from 'react-dom/server';
import { loadSsrEntryModul, resolveTemplatePath, mathPageUrl } from '../server/utils';
import { ViteDevServer } from 'vite'
// import path from 'path'
// import { serveStatic } from 'serve-static';



const isProd = process.env.NODE_ENV === 'production';
// const cwd = process.cwd();
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
    let vite: ViteDevServer | null = null;
  
    if (!isProd) {
      // 处于开发环境时，创建 vite 开发服务器
      vite = await (
        await import('vite')
      ).createServer({
        root: process.cwd(),
        server: {
          middlewareMode: 'ssr',
        },
      });
  
      // 注册 Vite Middlewares，主要用来处理客户端资源
      app.use(vite.middlewares);
    }
  
    return async (req, res, next) => {
      try {
        const { originalUrl } = req;
  
        if (!mathPageUrl(originalUrl)) {
          // 当前请求的是静态资源，则不进行处理
          return next();
        }
  
        // 1.加载服务端入口组件模块
        const { ServerEntry, fetchData } = await loadSsrEntryModul(vite);
        console.log('ServerEntry',ServerEntry)
        // 2.数据预取
        const data = await fetchData();
        console.log('data: ',data)
        // 3.渲染服务端组件，转换为 HTML 字符串
        const appHtml = renderToString(
          React.createElement(ServerEntry, { data })
        );
  
        // 4.拼接完整的 HTML 字符串返回给客户端
        const templatePath = resolveTemplatePath();
        let template = fs.readFileSync(templatePath, 'utf-8');
        if (!isProd && vite) {
          // 当前环境为开发环境
          // 所以需要注入 HMR、环境变量相关的代码
          template = await vite.transformIndexHtml(originalUrl, template);
        }
        const html = template
          .replace('<!-- SSR_APP -->', appHtml)
          // 注入数据标签，用于客户端注水
          .replace(
            '<!-- SSR_DATA -->',
            `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`
          );
  
        res.status(200).setHeader('Content-Type', 'text/html').end(html);
      } catch (error: any) {
        vite?.ssrFixStacktrace(error);
        console.error(error);
        res.status(500).end(error.message);
      }
    };
  }
  
  async function createServer() {
    const app = express();
  
    // 加入 vite ssr 中间件
    app.use(await createSsrMiddleware(app));
  
    // 用于处理静态资源
    if (isProd) {
      // serveStatic 来自第三方包 serve-static
    //   app.use(serveStatic(path.join(process.cwd(), 'dist/client')));
    }
  
    app.listen(5004, () => {
      console.log('服务器已启动');
      console.log('http://localhost:5004');
    });
  }
  
//   createServer();

// async function createServer() {
//     const app = express();

//     app.use(await createSsrMidlleware(app))

//     if(isProd){
//         app.use()
//     }

//     app.listen(3000, () => {
//         console.log('Node 服务器已启动~')
//         console.log('http://localhost:3000');
//     })


// }

createServer().catch(() => {
    console.log('服务创建失败')
})