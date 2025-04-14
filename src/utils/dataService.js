import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "../firebase/config"

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp) => {
  if (!timestamp) return null
  // If it's already a Firestore Timestamp object
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate()
  }
  // If it's a Date object, return it as is
  if (timestamp instanceof Date) {
    return timestamp
  }
  // If it's a timestamp number
  if (typeof timestamp === "number") {
    return new Date(timestamp)
  }
  return null
}

// Get all sectors
export const getSectors = async () => {
  const querySnapshot = await getDocs(collection(db, "sectors"))
  const sectors = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    sectors.push({
      id: doc.id,
      name: data.name,
      manager: data.manager,
      attendees: data.attendees || 0,
      lastUpdated: convertTimestamp(data.lastUpdated),
      completed: !!data.completed,
    })
  })
  return sectors
}

// Get a single sector by ID
export const getSector = async (id) => {
  const docRef = doc(db, "sectors", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      name: data.name,
      manager: data.manager,
      attendees: data.attendees || 0,
      lastUpdated: convertTimestamp(data.lastUpdated),
      completed: !!data.completed,
    }
  }

  return null
}

// Add a new sector
export const addSector = async (sectorData) => {
  const docRef = await addDoc(collection(db, "sectors"), {
    ...sectorData,
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    ...sectorData,
  }
}

// Update a sector
export const updateSector = async (id, sectorData) => {
  const sectorRef = doc(db, "sectors", id)

  // Convert JavaScript Date to Firestore Timestamp for lastUpdated
  const dataToUpdate = { ...sectorData }
  if (dataToUpdate.lastUpdated && dataToUpdate.lastUpdated instanceof Date) {
    dataToUpdate.lastUpdated = Timestamp.fromDate(dataToUpdate.lastUpdated)
  }

  await updateDoc(sectorRef, dataToUpdate)
  return { id, ...dataToUpdate }
}

// Delete a sector
export const deleteSector = async (id) => {
  await deleteDoc(doc(db, "sectors", id))
  return true
}

// Get event configuration
export const getEventConfig = async () => {
  const docRef = doc(db, "config", "eventConfig")
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()
    return {
      startDateTime: convertTimestamp(data.startDateTime),
    }
  }

  return { startDateTime: null }
}

// Update event configuration
export const updateEventConfig = async (configData) => {
  const configRef = doc(db, "config", "eventConfig")

  // Convert JavaScript Date to Firestore Timestamp
  const dataToUpdate = { ...configData }
  if (dataToUpdate.startDateTime && dataToUpdate.startDateTime instanceof Date) {
    dataToUpdate.startDateTime = Timestamp.fromDate(dataToUpdate.startDateTime)
  }

  await setDoc(
    configRef,
    {
      ...dataToUpdate,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return configData
}

// Reset all data
export const resetAllData = async () => {
  // Reset event config
  await updateEventConfig({ startDateTime: null })

  // Get all sectors
  const sectors = await getSectors()

  // Reset each sector
  for (const sector of sectors) {
    await updateSector(sector.id, {
      attendees: 0,
      lastUpdated: null,
      completed: false,
    })
  }

  return true
}

// Set up real-time listeners
export const onSectorsChange = (callback) => {
  const q = query(collection(db, "sectors"))
  return onSnapshot(q, (querySnapshot) => {
    const sectors = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      sectors.push({
        id: doc.id,
        name: data.name,
        manager: data.manager,
        attendees: data.attendees || 0,
        lastUpdated: convertTimestamp(data.lastUpdated),
        completed: !!data.completed,
      })
    })
    callback(sectors)
  })
}

export const onSectorChange = (id, callback) => {
  const docRef = doc(db, "sectors", id)
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      callback({
        id: docSnap.id,
        name: data.name,
        manager: data.manager,
        attendees: data.attendees || 0,
        lastUpdated: convertTimestamp(data.lastUpdated),
        completed: !!data.completed,
      })
    } else {
      callback(null)
    }
  })
}

export const onConfigChange = (callback) => {
  const docRef = doc(db, "config", "eventConfig")
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      callback({
        startDateTime: convertTimestamp(data.startDateTime),
      })
    } else {
      callback({ startDateTime: null })
    }
  })
}
