import './App.css'

type props = {
  data: {
    a: string
    b: number
  }
}

function App(props: props) {

  return (
    <>
      <span className="text">{props.data.a}</span>
    </>
  )
}

export default App
