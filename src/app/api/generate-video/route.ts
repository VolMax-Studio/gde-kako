import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
const dailyLimit = new Map();
const MAX_FREE_VIDEOS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  const userId = "user123"; // Zameni sa stvarnim user ID-om

  if (!dailyLimit.has(userId) || Date.now() - dailyLimit.get(userId).lastReset > DAY_MS) {
    dailyLimit.set(userId, { count: 0, lastReset: Date.now() });
  }

  const userData = dailyLimit.get(userId);
  // Privremeno isključeno za testiranje
  // if (userData.count >= MAX_FREE_VIDEOS) {
  //   return NextResponse.json({ success: false, error: "Limit od 3 videa dnevno premašen. Nadogradi na Pro!" }, { status: 403 });
  // }

  try {
    console.log('Pokrećem textToVideo sa promptom:', prompt); // Debag
    const videoBlob = await hf.textToVideo({
      model: 'genmo/mochi-1-preview',
      inputs: `${prompt}. Professional high-quality animation. Serbian business branding.`,
      parameters: {
        duration: 5, // 5 sekundi
        fps: 30,    // 30 frejmova po sekundi = 150 frejmova
        resolution: "480p",
      },
    });

    const arrayBuffer = await videoBlob.arrayBuffer();
    const base64Video = Buffer.from(arrayBuffer).toString('base64');
    const videoUrl = `data:video/mp4;base64,${base64Video}`;

    userData.count += 1;
    console.log('Video uspešno generisan, count:', userData.count); // Debag
    return NextResponse.json({ success: true, videoUrl, message: "Video uspešno generisan!" });
  } catch (error) {
    console.error('AI Video Generation Error:', error);
    return NextResponse.json({ success: false, error: 'Greška pri generisanju videa. Pokušajte ponovo. Detalji:', details: error.message }, { status: 500 });
  }
}
