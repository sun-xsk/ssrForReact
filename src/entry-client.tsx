import React from "react";
import ReactDOM from 'react-dom/client'
import App from "./App";

export async function fetchData() {
    const a = await Promise.resolve({ a: '客户端', b: 123 });
    return a
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const data = window.__SSR_DATA__ ?? fetchData() // 如果服务端获取数据失败我们要做客户端降级，在客户端获取数据


ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <React.StrictMode>
        {/*  eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-assignment */}
        <App data={data} />
    </React.StrictMode>
)

