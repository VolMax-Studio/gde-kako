'use client'
import { useState } from 'react'
import { Upload, Download, Sparkles } from 'lucide-react'

export default function VideoGenerator() {
  const [image, setImage] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('profesionalna logo animacija, 3D rotacija')
  const [video, setVideo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
        setError('Slika ne sme biti veća od 5MB.')
        return
      }
      setImage(file)
      setError(null)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Greška pri konverziji slike.'))
      reader.readAsDataURL(file)
    })
  }

  const generateVideo = async () => {
    if (!image) {
      setError('Molimo izaberite sliku.')
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

      if (!response.ok) throw new Error('Greška pri generisanju videa.')
      const result = await response.json()
      if (result.success) {
        setVideo(result.videoUrl)
      } else {
        throw new Error(result.error || 'Neuspešna generacija videa.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Došlo je do greške.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" /> AI Video Generator
        </h2>
        
        <div className="mb-6">
          <label className="block text-white text-lg font-medium mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5" /> Izaberite sliku:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-gray-300 bg-gray-700 rounded border p-2 file:mr-4 file:bg-blue-600 file:text-white file:rounded file:px-4 file:py-2"
          />
          {image && (
            <p className="text-green-400 mt-2">
              Slika: {image.name} ({(image.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-white text-lg font-medium mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Opišite animaciju:
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <button
          onClick={generateVideo}
          disabled={!image || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-pulse">Generiše video...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Generiši AI Video
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {video && (
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" /> Vaš AI Video je spreman!
            </h3>
            <video controls className="w-full max-w-md mx-auto rounded-lg">
              <source src={video} type="video/mp4" />
            </video>
            <div className="mt-4">
              <a
                href={video}
                download="gde-kako-ai-video.mp4"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Video
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
