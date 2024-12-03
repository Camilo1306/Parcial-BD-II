import React, { useEffect, useState } from "react"
import { db } from "../firebaseConfig"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy } from "firebase/firestore"
import "../styles/productoTabla.css"

function ProductosTabla() {
  const navigate = useNavigate()

  const [productos, setProductos] = useState([])
  const [editProducto, setEditProducto] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProductos, setfilteredProductos] = useState([])
  const [filtro, setFiltro] = useState("nombre")

  const handleLogout = () => {
    navigate("/home")
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const productosCollection = collection(db, "productos")
      const productosQuery = query(productosCollection, orderBy("nombre"))
      const productosSnapshot = await getDocs(productosQuery)
      const productosList = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProductos(productosList)
      setfilteredProductos(productosList)
    }
    fetchData()
  }, [])
  

  // Filtrar productos según el término de búsqueda
  useEffect(() => {
    setfilteredProductos(
      productos.filter((prod) =>
        prod[filtro].toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, productos])

  const handleUpdate = async (nombre, categoria, talla, updatedData) => {
    try {
      console.log("Datos a actualizar:", updatedData)
  
      // Validacion de que lo cambios sean validos
      if (isNaN(updatedData.precio) || isNaN(updatedData.stock)) {
        alert("Asegúrate de que el precio y el stock sean números válidos.")
        return
      }
  
      // Buscar el producto por nombre para actualizar
      const productosCollection = collection(db, "productos")
      const q = query(productosCollection, where("nombre", "==", nombre), where("categoria", "==", categoria), where("talla", "==", talla))
      const querySnapshot = await getDocs(q)
  
      if (querySnapshot.empty) {
        alert("No se encontró el producto con el nombre: " + nombre)
        return
      }
  
      // Solo actualizar Documento
      const productDoc = querySnapshot.docs[0] 
      await updateDoc(productDoc.ref, updatedData) 
  
      // Actualizar la lista
      setProductos((prevProductos) =>
        prevProductos.map((prod) =>
          prod.nombre === nombre ? { ...prod, ...updatedData } : prod
        )
      )
  
      // Resetear el producto en edición
      setEditProducto(null)
  
      alert("Producto actualizado correctamente.")
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
      alert("Hubo un error al actualizar el producto.")
    }
  }
  
  // Eliminar un producto por su nombre y categoria para evitar errores
  const handleDeleteByName = async (nombre, categoria, talla) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${nombre}" de la categoría "${categoria} con talla "${talla}"?`)) {
      try {
        const productosCollection = collection(db, "productos");
        // Buscar productos que coincidan con el nombre, la categoría y talla
        const q = query(
          productosCollection,
          where("nombre", "==", nombre),
          where("categoria", "==", categoria),
          where("talla", "==", talla)
        );
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          alert(`No se encontró ningún producto con el nombre "${nombre}" en la categoría "${categoria}".`);
          return;
        }
  
        // Eliminar productos que coincida con el nombre, categoría y talla
        for (const docSnapshot of querySnapshot.docs) {
          await deleteDoc(docSnapshot.ref);
        }
  
        // Actualizar la lista 
        setProductos((prev) =>
          prev.filter(
            (producto) =>
              !(producto.nombre === nombre && producto.categoria === categoria && producto.talla === talla)
          )
        );
  
        alert(`Producto "${nombre}" de la categoría "${categoria}" con la talla "${talla}"eliminado correctamente.`);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("Hubo un error al eliminar el producto.");
      }
    }
  };
  
    const handleDeleteObsoletos = async () => {
      if (window.confirm("¿Estás seguro de que quieres eliminar todos los productos con stock 0?")) {
        try {
          // Consultar productos con stock 0
          const productosCollection = collection(db, "productos")
          const q = query(productosCollection, where("stock", "==", 0))
          const querySnapshot = await getDocs(q)
    
          if (querySnapshot.empty) {
            alert("No se encontraron productos con stock 0.")
            return
          }
    
          // Eliminar cada producto con stock 0
          for (const docSnapshot of querySnapshot.docs) {
            await deleteDoc(docSnapshot.ref)
          }
    
          // Actualizar la lista local de productos
          setProductos((prev) => prev.filter((producto) => producto.stock !== 0))
          alert("Productos con stock 0 eliminados correctamente.")
        } catch (error) {
          console.error("Error al eliminar productos con stock 0:", error)
          alert("Hubo un error al eliminar productos.")
        }
      }
    }
  
  return (
    <div className="tablaProductos">
      <header className="header-register">
        <h1>Gestion de productos</h1>
        <button className="logout-button" onClick={handleLogout}> Salir </button>
        
      </header>      
      <div className="search-bar">
        
        <input
          type="text"
          placeholder={`Buscar por ${filtro}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="nombre">Nombre</option>
          <option value="categoria">Categoría</option>
        </select>
        <button className="logout-button" onClick={handleDeleteObsoletos}>
        Eliminar Productos Obsoletos
      </button>
       
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>talla</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductos.map((producto) => (
            <tr key={producto.id} style={{ backgroundColor: producto.stock < 5 ? "#ffcccc" : "white" }}>
              {editProducto === producto.id ? (
                <>
                <td><input type="text" defaultValue={producto.nombre} onChange={(e) => producto.nombre = e.target.value} disabled /></td>
                <td><input type="text" defaultValue={producto.categoria} onChange={(e) => producto.categoria = e.target.value} disabled/></td>
                <td><input type="text" defaultValue={producto.talla} onChange={(e) => producto.talla = e.target.value} disabled/></td>
                <td><input type="number" defaultValue={producto.precio} onChange={(e) => producto.precio = parseFloat(e.target.value)} /></td>
                <td><input type="number" defaultValue={producto.stock} onChange={(e) => producto.stock = parseInt(e.target.value)} /></td>
                <td>
                  <button className="btn-editar" onClick={() => handleUpdate(producto.nombre, producto.categoria, producto.talla, producto)}>Guardar</button>
                  <button className="logout-button" onClick={() => setEditProducto(null)}>Cancelar</button>
                </td>
              </>
              ) : (
                <>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{producto.talla}</td>
                  <td>${producto.precio.toFixed(2)}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => setEditProducto(producto.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="logout-button"
                      onClick={() => handleDeleteByName(producto.nombre, producto.categoria, producto.talla)}
                    >
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="footer-register"></footer>
    </div>
  )
}

export default ProductosTabla
