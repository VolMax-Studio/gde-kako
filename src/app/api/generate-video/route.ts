import { NextRequest, NextResponse } from 'next/server';

// Paperspace mock - dok ne postavimo pravi API endpoint
const PAPERSPACE_MOCK_ENABLED = true;
const PAPERSPACE_API_URL = 'YOUR_PAPERSPACE_URL_HERE'; // Ovde će biti vaš Paperspace URL

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  
  try {
    console.log('🚀 Generiram video sa Paperspace AI za prompt:', prompt);
    
    if (PAPERSPACE_MOCK_ENABLED) {
      // MOCK VERSION - simulacija Paperspace obrade
      console.log('📺 Koristim Paperspace mock...');
      
      // Simuliraj vreme obrade (kao da se izvršava u Paperspace-u)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Mock response - zameniti sa realnim video base64 iz Paperspace-a
      const mockVideoBase64 = "UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj"; // Skraćeni primer
      
      return NextResponse.json({ 
        success: true, 
        videoUrl: `data:video/mp4;base64,${mockVideoBase64}`,
        message: "✅ Video generisan sa Paperspace AI! (Mock verzija)",
        provider: "Paperspace",
        processing_time: "4 sekunde"
      });
      
    } else {
      // PRAVI PAPERSPACE API POZIV
      console.log('📡 Šalje zahtev na Paperspace...');
      
      const response = await fetch(`${PAPERSPACE_API_URL}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `${prompt}. Professional Serbian business animation, high quality, 480p`,
          num_frames: 4,
          duration: 5 
        }),
        timeout: 60000 // 60 sekundi timeout
      });
      
      if (!response.ok) {
        throw new Error(`Paperspace API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          videoUrl: result.video_url,
          message: "✅ Video generisan sa Paperspace AI!",
          provider: "Paperspace",
          processing_time: result.processing_time
        });
      } else {
        throw new Error(result.error || 'Paperspace generation failed');
      }
    }
    
  } catch (error) {
    console.error('❌ Paperspace Video Generation Error:', error);
    
    // Fallback na Hugging Face ako Paperspace ne radi
    console.log('🔄 Fallback na Hugging Face API...');
    
    try {
      // Vaš stari HF kod kao backup
      const { HfInference } = await import('@huggingface/inference');
      const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
      
      const videoBlob = await hf.textToVideo({
        model: 'genmo/mochi-1-preview',
        inputs: `${prompt}. Professional high-quality animation.`,
        parameters: { duration: 5, fps: 30 },
      });
      
      const arrayBuffer = await videoBlob.arrayBuffer();
      const base64Video = Buffer.from(arrayBuffer).toString('base64');
      const videoUrl = `data:video/mp4;base64,${base64Video}`;
      
      return NextResponse.json({ 
        success: true, 
        videoUrl,
        message: "✅ Video generisan sa Hugging Face (fallback)",
        provider: "Hugging Face"
      });
      
    } catch (fallbackError) {
      console.error('❌ Fallback takođe failed:', fallbackError);
      
      const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška';
      return NextResponse.json({ 
        success: false, 
        error: 'Greška pri generisanju videa. Paperspace i HF fallback neuspešni.', 
        details: errorMessage 
      }, { status: 500 });
    }
  }
}
