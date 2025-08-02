'use client';
import { useState, useEffect } from 'react';

export default function VideoGenerator() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('VolMax logo 3D rotation');
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Slika ne sme biti veća od 5MB.');
        return;
      }
      setImage(file);
      setError(null);
    }
  };

  const generateVideo = async () => {
    if (!prompt) {
      setError('Unesite opis animacije!');
      return;
    }
    setLoading(true);
    setError(null);
    setTimeElapsed(0);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();
      if (result.success) setVideo(result.videoUrl);
      else throw new Error(result.error || 'Greška');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška');
    } finally {
      setLoading(false);
    }
  };

  // Tajmer za praćenje vremena
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">AI Video Generator</h2>
      <div className="mb-4">
        <label className="block mb-2">Izaberite sliku (opciono):</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 bg-gray-700 rounded" />
        {image && <p className="text-green-400 mt-2">Slika: {image.name}</p>}
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
        {loading ? `Generiše... (${timeElapsed}s)` : 'Generiši Video'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {video && (
        <div className="mt-4">
          <video controls src={video} className="w-full rounded" />
        </div>
      )}
    </div>
  );
}
