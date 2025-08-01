'use client'
import { useState } from 'react'

export default function VideoGenerator() {
  const [image, setImage] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('VolMax logo 3D rotation')
  const [video, setVideo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0])
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const generateVideo = async () => {
    if (!image) {
      setError('Izaberite sliku!')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const imageBase64 = await convertToBase64(image)
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, prompt }),
      })
      const result = await response.json()
      if (result.success) setVideo(result.videoUrl)
      else throw new Error(result.error || 'Greška')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">AI Video Generator</h2>
      <div className="mb-4">
        <label className="block mb-2">Izaberite sliku:</label>
        <input type="file" onChange={handleImageUpload} className="w-full p-2 bg-gray-700 rounded" />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Opišite animaciju:</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>
      <button
        onClick={generateVideo}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded disabled:opacity-50"
      >
        {loading ? 'Generiše...' : 'Generiši Video'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {video && (
        <div className="mt-4">
          <video controls src={video} className="w-full rounded" />
        </div>
      )}
    </div>
  )
}
