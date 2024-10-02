import React from 'react'

import { Navbar } from './Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { IndexPage } from './component'
import { DetailsPage } from './component/details'
function App() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<IndexPage />} />
          <Route path='/details/:type/:id' element={<DetailsPage />} />
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
