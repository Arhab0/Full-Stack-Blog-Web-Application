
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
    <div className="flex justify-center">
        <div >
            <Navbar/>
            <Outlet/>
        </div>
    </div>
    </>
  )
}

export default App
