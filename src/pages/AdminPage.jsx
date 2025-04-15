"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { formatDate, formatWhatsAppMessage } from "../utils/helpers"
import {
  onSectorsChange,
  onConfigChange,
  addSector,
  updateSector,
  deleteSector,
  updateEventConfig,
  resetAllData,
} from "../utils/dataService"

function AdminPage({ isAuthenticated, setIsAuthenticated }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [sectors, setSectors] = useState([])
  const [config, setConfig] = useState({ startDateTime: null })
  const [activeTab, setActiveTab] = useState("datetime")
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetStatus, setResetStatus] = useState("")

  // Form states
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [newSectorName, setNewSectorName] = useState("")
  const [newSectorManager, setNewSectorManager] = useState("")
  const [editingSector, setEditingSector] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddSectorDialogOpen, setIsAddSectorDialogOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      // Set up real-time listeners
      const unsubscribeSectors = onSectorsChange((sectorsData) => {
        setSectors(sectorsData)
      })

      const unsubscribeConfig = onConfigChange((configData) => {
        setConfig(configData)

        if (configData.startDateTime) {
          const dateObj = configData.startDateTime
          setDate(dateObj.toISOString().split("T")[0])
          setTime(dateObj.toTimeString().slice(0, 5))
        } else {
          setDate("")
          setTime("")
        }
      })

      return () => {
        unsubscribeSectors()
        unsubscribeConfig()
      }
    }
  }, [isAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("adminAuth", "true")
      setIsAuthenticated(true)
      setLoginError("")
    } else {
      setLoginError("Usuario o contraseña incorrectos")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
  }

  const saveDateTime = async () => {
    if (!date || !time) return

    const [year, month, day] = date.split("-").map(Number)
    const [hours, minutes] = time.split(":").map(Number)
    const startDateTime = new Date(year, month - 1, day, hours, minutes)

    try {
      await updateEventConfig({
        startDateTime: startDateTime,
      })
    } catch (error) {
      console.error("Error saving date/time:", error)
    }
  }

  const handleAddSector = async () => {
    if (!newSectorName || !newSectorManager) return

    try {
      const newSector = {
        name: newSectorName,
        manager: newSectorManager,
        attendees: 0,
        completed: false,
      }

      await addSector(newSector)
      setNewSectorName("")
      setNewSectorManager("")
      setIsAddSectorDialogOpen(false)
    } catch (error) {
      console.error("Error adding sector:", error)
    }
  }

  const handleUpdateSector = async () => {
    if (!editingSector || !editingSector.name || !editingSector.manager) return

    try {
      await updateSector(editingSector.id, editingSector)
      setEditingSector(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating sector:", error)
    }
  }

  const handleDeleteSector = async (id) => {
    try {
      await deleteSector(id)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error deleting sector:", error)
    }
  }

  const handleResetConfiguration = async () => {
    try {
      setIsResetting(true)
      setResetStatus("Iniciando reinicio...")

      await resetAllData()

      setResetStatus("¡Reinicio completado!")
      setTimeout(() => {
        setIsResetDialogOpen(false)
        setIsResetting(false)
        setResetStatus("")
      }, 1000)
    } catch (error) {
      console.error("Error al reiniciar:", error)
      setResetStatus(`Error: ${error.message}`)
      setTimeout(() => {
        setIsResetting(false)
      }, 3000)
    }
  }

  const generateWhatsAppReport = () => {
    const message = formatWhatsAppMessage(sectors, config.startDateTime)
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
  
    setVh();
    window.addEventListener('resize', setVh);
  
    return () => window.removeEventListener('resize', setVh);
  }, []);
  

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(var(--vh)_*_100)] bg-white flex p-4">
        <div className="bg-white max-w-lg w-full text-gray-600">
        <Link to="/">
          <button className="flex items-center gap-1 h-8 p-4 mb-10 text-gray-700 font-semibold hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver
          </button>
        </Link>
          <div className="p-4">
            
            <h1 className="text-lg font-bold mb-4">Acceso Admin</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-md py-2 px-3 flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-red-500 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{loginError}</span>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="username" className="block font-medium text-sm">
                  Usuario
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Tu usuario"
                  className="w-full p-3 text-sm border border-gray-300 rounded outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block font-medium text-sm">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full p-3 text-sm border border-gray-300 rounded outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-gray-700 text-white rounded font-medium hover:bg-gray-800"
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
  

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-10">
        <Link to="/">
          <button className="flex items-center gap-1 h-8 py-4 text-gray-700 font-semibold hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver
          </button>
        </Link>
        <button className=" px-3 py-1.5 text-sm bg-red-700 rounded  text-white " onClick={handleLogout}>
          Salir
        </button>
      </div>

      

      <div className="mb-4">
        <div className="grid grid-cols-3 bg-gray-200 rounded overflow-hidden">
          <button
            className={`py-3 text-xs font-medium ${activeTab === "datetime" ? "bg-gray-700 text-white shadow" : "hover:bg-gray-200"}`}
            onClick={() => setActiveTab("datetime")}
          >
            Fecha y Hora
          </button>
          <button
            className={`py-3 text-xs font-medium ${activeTab === "sectors" ? "bg-gray-700 text-white shadow" : "hover:bg-gray-200"}`}
            onClick={() => setActiveTab("sectors")}
          >
            Sectores
          </button>
          <button
            className={`py-3 text-xs font-medium ${activeTab === "report" ? "bg-gray-700 text-white shadow" : "hover:bg-gray-200"}`}
            onClick={() => setActiveTab("report")}
          >
            Reporte
          </button>
        </div>
      </div>

      {activeTab === "datetime" && (
        <div className="">
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Fecha y hora actual</label>
              <div className="text-sm font-medium text-gray-600 ">
                {config.startDateTime ? (
                  <div className="font-semibold">

                    
                    <span className="  ">
                      {config.startDateTime.toLocaleString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className=" ml-2">
                      {config.startDateTime.toLocaleString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}hs
                    </span>
                  </div>
                  
                  ) : "No configurada"}
              </div>
            </div>

            <div className="space-y-4 text-gray-700 pt-4">
              <div className="space-y-1">
                <label className="block font-medium text-sm">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="time" className="block font-medium text-sm">
                  Hora
                </label>
                <div className="relative">
                  
                  <input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded outline-none text-sm"
                  />
                </div>
              </div>

              <button
                onClick={saveDateTime}
                disabled={!date || !time}
                className="w-full h-12 bg-gray-700  text-white rounded  disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
              >
                Guardar fecha y hora
              </button>

              <div className="pt-8 border-t border-gray-400 mt-8">
                <h3 className="font-medium mb-2">Reiniciar configuración</h3>
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-3 flex items-start gap-2">
                  
                  <span className="text-sm text-red-800">
                    Esta acción reiniciará todos los conteos de asistentes y el estado de los sectores.
                  </span>
                </div>

                <button
                  className="w-full h-12 mt-5 flex items-center justify-center gap-2  bg-red-700 text-white rounded"
                  onClick={() => setIsResetDialogOpen(true)}
                >
                  
                  Reiniciar todo
                </button>

                {isResetDialogOpen && (
                  <div className="fixed inset-0 bg-white flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                      
                      <div className="p-4">
                        {isResetting ? (
                          <div className="text-center py-4">
                            
                            <div className="animate-spin h-8 w-8 border-4 border-gray-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-sm">{resetStatus}</p>
                          </div>
                        ) : (
                         
                          <div className="">
                        <h3 className="font-bold mb-4">¿Está seguro?</h3>
                          <p className="text-sm ">
                            Esta acción reiniciará todos los conteos y configuraciones. No se puede deshacer.
                          </p>
                      </div>
                        )}
                      </div>
                      <div className="p-4  flex flex-col gap-2">
                        {!isResetting && (
                          <>
                            <button
                              onClick={handleResetConfiguration}
                              className="w-full h-12 bg-red-800  text-white rounded font-medium"
                            >
                              Sí, reiniciar todo
                            </button>
                            <button
                              onClick={() => setIsResetDialogOpen(false)}
                              className="w-full h-12  bg-gray-300  rounded font-medium"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "sectors" && (
        <div className="p-4 space-y-4">
          <button
            onClick={() => setIsAddSectorDialogOpen(true)}
            className="w-full h-12 flex items-center justify-center gap-2 bg-gray-700 text-white rounded font-medium"
          >
            
            Agregar sector
          </button>

          <div className="space-y-3 pt-2">
            <h3 className="font-medium text-sm">Sectores ({sectors.length})</h3>

            {sectors.length === 0 ? (
              <p className="text-center py-4 text-sm text-gray-500">No hay sectores configurados</p>
            ) : (
              <div className="space-y-2">
                {sectors.map((sector) => (
                  <div key={sector.id} className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-md">
                    <div>
                      <div className="font-medium text-sm mb-1">{sector.name}</div>
                      <div className="text-xs text-gray-500">
                        <p>
                        {sector.manager}
                        </p>
                        <p>

                          asistentes: {sector.attendees || 0}
                        </p>
                      </div>
                    </div>
                    <button
                      className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      onClick={() => {
                        setEditingSector(sector)
                        setIsDialogOpen(true)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "report" && (
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            {sectors.length === 0 ? (
              <p className="text-center py-4 text-sm text-gray-500">No hay sectores para generar reporte</p>
            ) : (
              <div className="">
                {config.startDateTime ? (
                  <div className="font-bold text-sm p-3 text-gray-700 mb-4">

                    
                    <span className="  ">
                      {config.startDateTime.toLocaleString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className=" ml-2">
                      {config.startDateTime.toLocaleString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}hs
                    </span>
                  </div>
                  
                  ) : "No configurada"}
                {sectors.map((sector) => (
                  <div key={sector.id} className="flex items-center justify-between p-3 text-gray-700">
                    <div>
                      <div className="font-semibold text-sm">{sector.name}</div>
                      <div className="text-xs">{sector.manager}</div>
                    </div>
                    <div className="font-semibold text-sm">{sector.attendees || 0}</div>
                  </div>
                ))}

                <div className="flex text-gray-600 items-center justify-between p-3 border-t border-gray-300 mt-4">
                  <div className="font-bold text-sm">Total</div>
                  <div className="text-lg font-bold">
                    {sectors.reduce((sum, sector) => sum + (sector.attendees || 0), 0)}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={generateWhatsAppReport}
              className="w-full h-12 flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 text-white rounded font-medium mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={sectors.length === 0}
            >
              
              Compartir por WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Modal para agregar sector */}
      {isAddSectorDialogOpen && (
        <div className="fixed inset-0 bg-white pt-20 flex  p-4 z-50">
          <div className="bg-white  max-w-lg w-full text-gray-600">
            <div className="p-4 ">
              <h3 className="font-bold">Agregar Sector</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="sectorName" className="block font-medium text-sm">
                  Nombre del sector
                </label>
                <input
                  id="sectorName"
                  value={newSectorName}
                  onChange={(e) => setNewSectorName(e.target.value)}
                  placeholder="Ej: Sector A"
                  className="w-full p-3 text-sm border border-gray-300 rounded outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sectorManager" className="block font-medium text-sm">
                  Encargado
                </label>
                <input
                  id="sectorManager"
                  value={newSectorManager}
                  onChange={(e) => setNewSectorManager(e.target.value)}
                  placeholder="Nombre del encargado"
                  className="w-full p-3 text-sm border border-gray-300 rounded outline-none"
                />
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2 mt-10">
              <button
                onClick={handleAddSector}
                disabled={!newSectorName || !newSectorManager}
                className="w-full h-12 bg-gray-700  text-white rounded font-medium disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsAddSectorDialogOpen(false)}
                className="w-full h-12  bg-gray-300  rounded font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

{isDialogOpen && editingSector && (
  <div className="fixed inset-0 bg-white pt-20 flex p-4 z-50">
    <div className="bg-white max-w-lg w-full text-gray-600">
      <div className="p-4">
        <h3 className="font-bold">Editar Sector</h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="editSectorName" className="block font-medium text-sm">
            Nombre del sector
          </label>
          <input
            id="editSectorName"
            value={editingSector.name}
            onChange={(e) => setEditingSector({ ...editingSector, name: e.target.value })}
            placeholder="Ej: Sector A"
            className="w-full p-3 text-sm border border-gray-300 rounded outline-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="editSectorManager" className="block font-medium text-sm">
            Encargado
          </label>
          <input
            id="editSectorManager"
            value={editingSector.manager}
            onChange={(e) => setEditingSector({ ...editingSector, manager: e.target.value })}
            placeholder="Nombre del encargado"
            className="w-full p-3 text-sm border border-gray-300 rounded outline-none"
          />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 mt-10">
        <button
          onClick={handleUpdateSector}
          className="w-full h-12 bg-gray-700 text-white rounded font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!editingSector.name || !editingSector.manager}
        >
          Guardar
        </button>
        <button
          onClick={() => setIsDialogOpen(false)}
          className="w-full h-12  bg-gray-300  rounded font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={() => handleDeleteSector(editingSector.id)}
          className="w-full h-12 bg-red-700 hover:bg-red-700 text-white rounded font-medium mt-10"
        >
          Eliminar sector
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default AdminPage
