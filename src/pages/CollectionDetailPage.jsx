<<<<<<< ours
<<<<<<< ours
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FolderPlus, Trash2, X } from 'lucide-react'
import agents from '../agents/registry'
import AgentCard from '../components/AgentCard'
import { useCollections } from '../lib/useCollections'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function CollectionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCollectionById, deleteCollection, removeAgentFromCollection } = useCollections()
  const collection = getCollectionById(id)
  useDocumentTitle(collection ? `${collection.name} Collection` : 'Collection not found')

  if (!collection) return <div className="animate-fade-in rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-border dark:bg-surface-card"><h1 className="text-xl font-semibold text-gray-900 dark:text-text-primary">Collection not found</h1><p className="mt-2 text-sm text-gray-500 dark:text-text-secondary">This collection may have been deleted.</p><Link to="/collections" className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover">Back to Collections</Link></div>

  const collectionAgents = collection.agentIds.map((agentId) => agents.find((agent) => agent.id === agentId)).filter(Boolean)
  const staleCount = collection.agentIds.length - collectionAgents.length

  const handleDelete = () => { deleteCollection(collection.id); navigate('/collections') }

  return <div className="animate-fade-in space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><Link to="/collections" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover"><ArrowLeft size={16} />Collections</Link><h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary">{collection.name}</h1><p className="mt-2 text-sm text-gray-500 dark:text-text-secondary">{collectionAgents.length} runnable agents{staleCount > 0 ? ` · ${staleCount} unavailable agents hidden` : ''}</p></div>
      <button onClick={handleDelete} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 size={16} />Delete Collection</button>
    </div>

    {collectionAgents.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-border dark:bg-surface-card"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"><FolderPlus size={24} /></div><h2 className="text-lg font-semibold text-gray-900 dark:text-text-primary">No agents in this collection yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-text-secondary">Browse agents and use the folder button on any agent card to add it here.</p><Link to="/" className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover">Browse Agents</Link></div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {collectionAgents.map((agent) => <div key={agent.id} className="relative"><AgentCard agent={agent} /><button onClick={() => removeAgentFromCollection(collection.id, agent.id)} className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-red-600 shadow hover:bg-red-50 dark:bg-surface-card/90 dark:hover:bg-red-500/10"><X size={13} />Remove</button></div>)}
    </div>}
  </div>
=======
=======
>>>>>>> theirs
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AgentCard from '../components/AgentCard'
import CollectionAgentPicker from '../components/collections/CollectionAgentPicker'
import { useAgents } from '../lib/useAgents'
import { MAX_COLLECTION_AGENTS, useCollections } from '../lib/useCollections'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function fallbackCollection(id) {
  return {
    id,
    name: 'Agent Collection',
    description: 'Select agents below to build this collection.',
    agentIds: [],
  }
}

export default function CollectionDetailPage() {
  const { id = 'default' } = useParams()
  const { agents, loading, error } = useAgents()
  const { collections, addAgentToCollection, removeAgentFromCollection } = useCollections()

  const collection = useMemo(() => (
    collections.find((item) => item.id === id) || fallbackCollection(id)
  ), [collections, id])

  useDocumentTitle(collection.name ? `${collection.name} Collection` : 'Agent Collection')

  const agentById = useMemo(() => new Map(agents.map((agent) => [agent.id, agent])), [agents])
  const collectionAgents = useMemo(() => (
    (collection.agentIds || [])
      .map((agentId) => agentById.get(agentId))
      .filter(Boolean)
  ), [agentById, collection.agentIds])

  const handleAddAgent = (agentId) => addAgentToCollection(collection.id, agentId)
  const handleRemoveAgent = (agentId) => removeAgentFromCollection(collection.id, agentId)

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-text-secondary">Loading agents…</p>
  }

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-300">Unable to load agents. Please refresh and try again.</p>
  }

  return (
    <div className="animate-fade-in space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-accent dark:text-text-secondary">
        <ArrowLeft size={16} />
        Back to all agents
      </Link>

      <header className="premium-section rounded-2xl border border-gray-200 bg-white p-6 dark:border-border dark:bg-surface-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Agent collection</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-text-primary">{collection.name}</h1>
        {collection.description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-text-secondary">
            {collection.description}
          </p>
        )}
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Current collection agents</h2>
            <p className="text-sm text-gray-500 dark:text-text-secondary">Run agents directly from this curated collection.</p>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-text-muted">
            {collectionAgents.length} / {MAX_COLLECTION_AGENTS}
          </span>
        </div>

        {collectionAgents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {collectionAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-border dark:bg-surface-card dark:text-text-secondary">
            No agents in this collection yet. Use the checklist below to add agents.
          </div>
        )}
      </section>

      <CollectionAgentPicker
        collection={collection}
        agents={agents}
        onAddAgent={handleAddAgent}
        onRemoveAgent={handleRemoveAgent}
        maxAgents={MAX_COLLECTION_AGENTS}
      />
    </div>
  )
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
}
