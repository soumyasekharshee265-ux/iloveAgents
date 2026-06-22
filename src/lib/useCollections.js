import { useCallback, useEffect, useState } from 'react'

<<<<<<< ours
<<<<<<< ours
export const MAX_COLLECTIONS = 10
export const MAX_AGENTS_PER_COLLECTION = 15
export const COLLECTIONS_STORAGE_KEY = 'ila_agent_collections'

const listeners = new Set()

function notify() {
  listeners.forEach((fn) => fn())
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `collection-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeCollection(collection) {
  if (!collection || typeof collection !== 'object') return null
  const name = typeof collection.name === 'string' ? collection.name.trim() : ''
  if (!name) return null
  const now = new Date().toISOString()
  const agentIds = Array.isArray(collection.agentIds)
    ? [...new Set(collection.agentIds.filter((id) => typeof id === 'string' && id.trim()).map((id) => id.trim()))].slice(0, MAX_AGENTS_PER_COLLECTION)
    : []

  return {
    id: typeof collection.id === 'string' && collection.id.trim() ? collection.id : createId(),
    name,
    agentIds,
    createdAt: typeof collection.createdAt === 'string' ? collection.createdAt : now,
    updatedAt: typeof collection.updatedAt === 'string' ? collection.updatedAt : now,
  }
}

export function loadCollections() {
  if (typeof localStorage === 'undefined') return []

  try {
    const raw = localStorage.getItem(COLLECTIONS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const seenIds = new Set()
    return parsed
      .map(normalizeCollection)
      .filter(Boolean)
      .filter((collection) => {
        if (seenIds.has(collection.id)) return false
        seenIds.add(collection.id)
        return true
      })
      .slice(0, MAX_COLLECTIONS)
=======
=======
>>>>>>> theirs
export const MAX_COLLECTION_AGENTS = 15
const STORAGE_KEY = 'agentCollections'

function normalizeCollection(collection) {
  return {
    ...collection,
    agentIds: Array.from(new Set(collection?.agentIds || [])).filter(Boolean).slice(0, MAX_COLLECTION_AGENTS),
  }
}

function readCollections() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.map(normalizeCollection) : []
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
  } catch {
    return []
  }
}

<<<<<<< ours
<<<<<<< ours
export function saveCollections(collections) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections))
}

function persist(updater) {
  const current = loadCollections()
  const result = updater(current)
  const next = result.collections || current
  saveCollections(next)
  notify()
  return { ...result, collections: next }
}

export function useCollections() {
  const [collections, setCollections] = useState(loadCollections)

  useEffect(() => {
    const sync = () => setCollections(loadCollections())
    listeners.add(sync)
    return () => listeners.delete(sync)
  }, [])

  const runMutation = useCallback((updater) => {
    const result = persist(updater)
    setCollections(result.collections)
    return result
  }, [])

  const createCollection = useCallback((name) => {
    const trimmedName = name.trim()
    if (!trimmedName) return { ok: false, error: 'Collection name is required.' }

    return runMutation((current) => {
      if (current.length >= MAX_COLLECTIONS) {
        return { ok: false, error: `You can create up to ${MAX_COLLECTIONS} collections.` }
      }
      const now = new Date().toISOString()
      const collection = { id: createId(), name: trimmedName, agentIds: [], createdAt: now, updatedAt: now }
      return { ok: true, collection, collections: [collection, ...current] }
    })
  }, [runMutation])

  const deleteCollection = useCallback((collectionId) => {
    return runMutation((current) => ({ ok: true, collections: current.filter((collection) => collection.id !== collectionId) }))
  }, [runMutation])

  const renameCollection = useCallback((collectionId, name) => {
    const trimmedName = name.trim()
    if (!trimmedName) return { ok: false, error: 'Collection name is required.' }

    return runMutation((current) => ({
      ok: true,
      collections: current.map((collection) => collection.id === collectionId
        ? { ...collection, name: trimmedName, updatedAt: new Date().toISOString() }
        : collection),
    }))
  }, [runMutation])

  const addAgentToCollection = useCallback((collectionId, agentId) => {
    return runMutation((current) => {
      const collection = current.find((item) => item.id === collectionId)
      if (!collection) return { ok: false, error: 'Collection not found.' }
      if (collection.agentIds.includes(agentId)) return { ok: false, error: 'This agent is already in that collection.' }
      if (collection.agentIds.length >= MAX_AGENTS_PER_COLLECTION) {
        return { ok: false, error: `Collections can contain up to ${MAX_AGENTS_PER_COLLECTION} agents.` }
      }

      return {
        ok: true,
        collections: current.map((item) => item.id === collectionId
          ? { ...item, agentIds: [...item.agentIds, agentId], updatedAt: new Date().toISOString() }
          : item),
      }
    })
  }, [runMutation])

  const removeAgentFromCollection = useCallback((collectionId, agentId) => {
    return runMutation((current) => ({
      ok: true,
      collections: current.map((collection) => collection.id === collectionId
        ? { ...collection, agentIds: collection.agentIds.filter((id) => id !== agentId), updatedAt: new Date().toISOString() }
        : collection),
    }))
  }, [runMutation])

  const getCollectionById = useCallback((collectionId) => collections.find((collection) => collection.id === collectionId), [collections])
  const isAgentInCollection = useCallback((collectionId, agentId) => Boolean(getCollectionById(collectionId)?.agentIds.includes(agentId)), [getCollectionById])

  return { collections, createCollection, deleteCollection, renameCollection, addAgentToCollection, removeAgentFromCollection, getCollectionById, isAgentInCollection }
=======
=======
>>>>>>> theirs
function writeCollections(collections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections.map(normalizeCollection)))
}

function createFallbackCollection(collectionId) {
  return {
    id: collectionId,
    name: 'Agent Collection',
    description: 'Select agents to build this collection.',
    agentIds: [],
  }
}

export function useCollections() {
  const [collections, setCollections] = useState(() => readCollections())

  useEffect(() => {
    writeCollections(collections)
  }, [collections])

  const updateCollection = useCallback((collectionId, updater) => {
    setCollections((current) => {
      const hasCollection = current.some((collection) => collection.id === collectionId)
      const baseCollections = hasCollection ? current : [...current, createFallbackCollection(collectionId)]

      return baseCollections.map((collection) => {
        if (collection.id !== collectionId) return collection
        return normalizeCollection(updater(collection))
      })
    })
  }, [])

  const addAgentToCollection = useCallback((collectionId, agentId) => {
    if (!agentId) return false
    let added = false

    updateCollection(collectionId, (collection) => {
      const agentIds = Array.from(new Set(collection.agentIds || [])).filter(Boolean)
      if (agentIds.includes(agentId) || agentIds.length >= MAX_COLLECTION_AGENTS) {
        return { ...collection, agentIds }
      }

      added = true
      return { ...collection, agentIds: [...agentIds, agentId] }
    })

    return added
  }, [updateCollection])

  const removeAgentFromCollection = useCallback((collectionId, agentId) => {
    updateCollection(collectionId, (collection) => ({
      ...collection,
      agentIds: (collection.agentIds || []).filter((id) => id !== agentId),
    }))
  }, [updateCollection])

  return { collections, addAgentToCollection, removeAgentFromCollection }
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
}
