// src/components/Hero.tsx
import React from 'react'

export default function Hero() {
  return (
    <section className="relative py-20 px-4 text-center text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
          Gde i Kako Napraviti
          <br />
          <span className="text-white">AI Videozapise</span>
        </h1>
        
        <p className="text-2xl mb-8 text-gray-300">
          🇷🇸 Prvi srpski AI video generator
          <br />
          Besplatno generiši profesionalne animacije za 60 sekundi!
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-lg">
          <span className="bg-blue-600/20 px-4 py-2 rounded-full border border-blue-400">
            ✨ Upload sliku
          </span>
          <span className="bg-purple-600/20 px-4 py-2 rounded-full border border-purple-400">
            🤖 AI generiše video
          </span>
          <span className="bg-red-600/20 px-4 py-2 rounded-full border border-red-400">
            📱 Download za TikTok/Instagram
          </span>
        </div>
      </div>
    </section>
  )
}
