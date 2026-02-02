'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { sendMessage } from '@/actions/ai/generateQuestions.actions'

export default function AIGeneratePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const handleGenerate = async () => {
    if (!query.trim()) return

    try {
      setLoading(true)
      setResponse(null)
      const aiResponse = await sendMessage(query.trim())
      setResponse(aiResponse)
    } catch (err) {
      console.error(err)
      alert('Failed to generate questions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
            <Sparkles size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              AI Question Generator
            </h1>
            <p className="text-sm text-gray-500">
              Generate precise GRE / PPL exam questions by topic
            </p>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>

          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Probability, Sentence Equivalence, Quantitative Comparison – Geometry"
            className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {loading ? 'Generating…' : 'Generate Questions'}
            </button>
          </div>
        </div>

        {/* Output */}
        {response && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Generated Questions
            </h2>

            {/* 🔤 Enhanced Typography */}
            <div className="font-serif text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
