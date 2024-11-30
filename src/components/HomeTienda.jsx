import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import regisPro from "../icons/agregar-producto.png"
import editarPro from "../icons/contrato.png"
import "../styles/homeTienda.css"

export const HomeTienda = () => {
    const navigate = useNavigate()

    return (
        <>
            <div className="admin-container">
                <header className="admin-header">
                    <h1>Tienda de Ropa</h1>
                </header>
                <main className="admin-main">
                    <div className="admin-panel">
                        <h2>Panel Administrador</h2>
                        <div className="card-container">
                            <div className="card">
                                <img
                                    src={regisPro}
                                    alt="{Registro Producto}"
                                    className="card-icon"
                                />
                                <h3>Agregar Nuevo Producto</h3>
                                <p>Agregar Nuevo Producto a la Tienda</p>
                                <button onClick={() => navigate("/regisproducto")}>Agregar Producto</button>
                            </div>
                            <div className="card">
                                <img
                                    src={editarPro}
                                    alt="Editar Productos"
                                    className="card-icon"
                                />
                                <h3>Gestion de Prodctos</h3>
                                <p>
                                    Consultar, Eliminar o Editar Productos
                                </p>
                                <button onClick={() => navigate("/productos")}>Gestion</button>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="footer-register"></footer>
            </div>
        </>
    )
}

export default HomeTienda