import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import HomeTienda from "./components/HomeTienda"
import RegisProducto from "./components/RegisProducto"
import ProductosTabla from "./components/ProductosTabla"

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomeTienda />} />
          <Route path="/regisproducto" element={<RegisProducto />} />
          <Route path="/productos" element={<ProductosTabla />} />
        </Routes>
      </Router>
     
  )
}

export default App
