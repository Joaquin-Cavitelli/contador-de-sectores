"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import CountdownTimer from "../components/CountdownTimer"
import { onSectorChange, onConfigChange, updateSector } from "../utils/dataService"

function SectorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sector, setSector] = useState(null)
  const [config, setConfig] = useState({ startDateTime: null })
  const [attendees, setAttendees] = useState("") // Inicializar como string vacío
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [canCount, setCanCount] = useState(false)

  useEffect(() => {
    const unsubscribeSector = onSectorChange(id, (sectorData) => {
      if (!sectorData) {
        setError("El sector no existe")
        setLoading(false)
        return
      }

      setSector(sectorData)
      setAttendees(sectorData.attendees?.toString() || "") // Convertir a string o dejar vacío
      setLoading(false)
    })

    const unsubscribeConfig = onConfigChange((configData) => {
      setConfig(configData)

      if (configData.startDateTime && new Date() >= configData.startDateTime) {
        setCanCount(true)
      }
    })

    return () => {
      unsubscribeSector()
      unsubscribeConfig()
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!sector) return

    try {
      setSubmitting(true)

      const now = new Date()

      await updateSector(sector.id, {
        attendees: Number(attendees), // Convertir a número
        lastUpdated: now,
        completed: true,
      })

      navigate("/")
    } catch (err) {
      setError("Error al guardar los datos")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

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

  if (error || !sector) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md py-3 mb-4 flex items-start gap-2">
          
          <span>{error || "No se pudo cargar el sector"}</span>
        </div>
        <Link to="/">
          <button className="flex items-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
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
            Volver al inicio
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Link to="/" className="inline-block mb-4">
        <button className="flex items-center gap-1 h-8 px-2 text-gray-600 hover:text-gray-900">
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

      <div className="">
        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-2xl text-gray-700 font-bold">{sector.name}</h1>
            <p className=" text-gray-500">Encargado: {sector.manager}</p>
          </div>

          {!config.startDateTime ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 flex items-start gap-2">
            
              <span className="text-xs text-yellow-800">No se ha configurado la fecha y hora de inicio.</span>
            </div>
          ) : !canCount ? (
            <CountdownTimer targetDate={config.startDateTime} onComplete={() => setCanCount(true)} />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="attendees" className="text-sm block">
                  Número de asistentes
                </label>
                <input
                  id="attendees"
                  type="number"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  required
                  className="w-full text-gray-600 font-medium text-lg h-12 px-3 py-2 border border-gray-300 rounded outline-none "
                />
              </div>
            </div>
          )}
        </div>
        {canCount && (
          <div className="p-4 pt-0">
            <button
              className="w-full h-12 text-base bg-gray-800 text-white rounded font-medium"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Guardando...
                </>
              ) : sector.completed ? (
                "Actualizar conteo"
              ) : (
                "Guardar conteo"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SectorPage
