import App from './App'

type props = {
    data: {
        a: string
        b: number
    }
}

export function ServerEntry(props: props) {
    return (
        <App data={props.data} />
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export async function fetchData() {
    const a = await Promise.resolve({ a: '服务端', b: 123 });
    return a
}