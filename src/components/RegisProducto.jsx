import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebaseConfig"
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore"
import "../styles/register.css"

export const RegisProducto = () => {
  const navigate = useNavigate()

  const [nombre, setNombre] = useState("")
  const [categoria, setCategoria] = useState("")
  const [precio, setPrecio] = useState("")
  const [stock, setStock] = useState("")
  const [talla, setTalla] = useState("")
  const [error, setError] = useState("")

  const handleLogout = () => {
    navigate("/home")
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      // Verificar si ya existe un producto con el mismo nombre, categoría y talla
      const productsRef = collection(db, "productos")
      const q = query(productsRef, where("nombre", "==", nombre.toUpperCase()), where("categoria", "==", categoria.toUpperCase()), where("talla", "==", parseFloat(talla)))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        alert("Ya existe un producto con este nombre y categoría y talla.")
        return
      }

      // Agregar Producto
     // const newId = await getNewProductId() // Obtiene el siguiente ID disponible
      await setDoc(doc(productsRef), {
        //id: newId,
        nombre: nombre.toUpperCase(),
        categoria: categoria.toUpperCase(),
        talla: parseFloat(talla),
        precio: parseFloat(precio),
        stock: parseInt(stock),
      })

      alert("Producto registrado exitosamente")
      setNombre("")
      setCategoria("")
      setPrecio("")
      setStock("")
      setTalla("")
      setError("")
    } catch (error) {
      console.error("Error al registrar el producto:", error)
      setError("Hubo un error al registrar el producto.")
    }
  }

  // const getNewProductId = async () => {
  //   const productsRef = collection(db, "productos")
  //   const querySnapshot = await getDocs(productsRef)
  //   let newId = 1
  //   if (!querySnapshot.empty) {
  //     const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1].data()
  //     newId = lastDoc.id + 1
  //   }
  //   return newId
  // }

  return (
    <div className="register-container">
      <header className="header-register">
        <h2>Tienda de Ropa</h2>
        <button className="logout-button" onClick={handleLogout}> Salir </button>
      </header>
      <main className="main-register">
        <div className="register-box">
          <h2>Registrar Producto</h2>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.toUpperCase())}
              required
            />
            <input
              type="text"
              placeholder="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value.toUpperCase())}
              required
            />
            <input
              type="number"
              placeholder="Talla"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
            <button type="submit">Registrar Producto</button>
          </form>
        </div>
      </main>
      <footer className="footer-register"></footer>
    </div>
  )
}

export default RegisProducto
