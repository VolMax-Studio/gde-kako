// src/app/api/generate-video/route.ts
import { HfInference } from '@huggingface/inference'
import { NextRequest, NextResponse } from 'next/server'

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN)

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageBase64 } = await request.json()
    
    // Mochi-1 integration
    const videoBlob = await hf.textToVideo({
      model: 'genmo/mochi-1-preview',
      inputs: `${prompt}. Professional high-quality animation. Serbian business branding.`,
      parameters: {
        duration: 5,
        fps: 30,
        resolution: "480p"
      }
    })
    
    // Convert to base64 for frontend
    const arrayBuffer = await videoBlob.arrayBuffer()
    const base64Video = Buffer.from(arrayBuffer).toString('base64')
    
    return NextResponse.json({ 
      success: true, 
      videoData: `data:video/mp4;base64,${base64Video}`,
      message: "Video uspešno generisan!"
    })
    
  } catch (error) {
    console.error('AI Video Generation Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Greška pri generisanju videa. Pokušajte ponovo.' 
    }, { status: 500 })
  }
}
