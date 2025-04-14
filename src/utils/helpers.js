export function formatDate(date) {
  if (!date) return "No configurado"
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function formatTime(date) {
  if (!date) return "--:--"
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Updated formatDateTime function with more explicit formatting
export function formatDateTime(date) {
  if (!date) return "No configurado"

  // Format date part
  const dateStr = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)

  // Format time part
  const timeStr = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)

  // Combine date and time with a clear separator
  return `${dateStr} a las ${timeStr}`
}

export function formatWhatsAppMessage(sectors, startDateTime) {
  let message = "📊 *REPORTE DE ASISTENTES* 📊\n\n"

  // Agregar fecha y hora si están configuradas
  if (startDateTime) {
    const dateStr = new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(startDateTime)

    const timeStr = new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(startDateTime)

    message += `📅 *Fecha:* ${dateStr}\n`
    message += `⏰ *Hora:* ${timeStr}\n\n`
  }

  let totalAttendees = 0
  sectors.forEach((sector) => {
    totalAttendees += sector.attendees || 0
    message += `*${sector.name}*\n`
    message += `👤 Encargado: ${sector.manager}\n`
    message += `🧑‍🤝‍🧑 Asistentes: ${sector.attendees || 0}\n\n`
  })

  message += `*TOTAL DE ASISTENTES: ${totalAttendees}*`
  return encodeURIComponent(message)
}
