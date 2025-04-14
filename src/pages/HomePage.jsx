"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import SectorCard from "../components/SectorCard"
import { formatDate, formatTime } from "../utils/helpers"
import { onSectorsChange, onConfigChange } from "../utils/dataService"

function HomePage() {
  const [sectors, setSectors] = useState([])
  const [config, setConfig] = useState({ startDateTime: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up real-time listeners
    const unsubscribeSectors = onSectorsChange((sectorsData) => {
      setSectors(sectorsData)
      setLoading(false)
    })

    const unsubscribeConfig = onConfigChange((configData) => {
      setConfig(configData)
    })

    return () => {
      unsubscribeSectors()
      unsubscribeConfig()
    }
  }, [])

  // Calculate stats
  const totalAttendees = sectors.reduce((sum, sector) => sum + (sector.attendees || 0), 0)
  const completedSectors = sectors.filter((sector) => sector.completed).length
  const completionPercentage = sectors.length > 0 ? (completedSectors / sectors.length) * 100 : 0
  const allSectorsCompleted = sectors.length > 0 && completedSectors === sectors.length

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <Link to="/admin">
        <div className="bg-white rounded-b shadow-md mb-8 p-10 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                
                Hora de inicio:
              </span>
              <span className="text-2xl text-gray-600 font-bold mt-2">
                {config.startDateTime ? formatTime(config.startDateTime) : "--:--"}
              </span>
              <span className="text-xs text-gray-500">
                {config.startDateTime ? formatDate(config.startDateTime) : "No configurado"}
              </span>
            </div>
            <div className="flex flex-col justify-self-end">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                
                Total asistentes:
              </span>
              <span className="text-2xl text-gray-600 font-bold mt-2 flex items-center gap-1 self-end">{totalAttendees}

              <span className="material-symbols-outlined">group</span>

              </span>
            </div>
          </div>

          {!config.startDateTime && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-2">
              
              <span className="text-xs text-yellow-800">No se ha configurado la fecha y hora de inicio.</span>
            </div>
          )}

          {allSectorsCompleted && sectors.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-md py-2 px-3">
              <span className="text-xs font-medium text-green-800">
                ¡Conteo completado! Total: {totalAttendees} asistentes.
              </span>
            </div>
          )}

          <div className="space-y-1">
            
              
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
              <span className="text-xs text-gray-500 flex justify-end">
                {completedSectors} de {sectors.length} sectores
              </span>
          </div>
        </div>
      </Link>

      {sectors.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-md py-3 mx-4 flex items-start gap-2">
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
            className="h-4 w-4 text-blue-500 mt-0.5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>No hay sectores configurados. Acceda a Admin para agregar sectores.</span>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {sectors.map((sector) => (
            <SectorCard key={sector.id} sector={sector} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
