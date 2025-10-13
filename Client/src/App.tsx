import React from 'react'
import {Routes,Route} from 'react-router-dom'
import AddProject from './Pages/AddProject'
import Home from './Pages/Home'
import EditProject from './Pages/ViewProject'
import Navbar from './Components/Navbar'
import ViewProject from './Pages/ViewProject'
const App = () => {
  return (
    <div >
      <Navbar/>
      <div className='pt-16'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/addproj' element={<AddProject/>}/>
        <Route path='/viewproj' element={<ViewProject/>}/>
      </Routes>
      </div>
    </div>
  )
}

export default App
