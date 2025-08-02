import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
const dailyLimit = new Map();
// Uklonjeno MAX_FREE_VIDEOS i DAY_MS jer se ne koriste trenutno
// const MAX_FREE_VIDEOS = 3;
// const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  const userId = "user123"; // Zameni sa stvarnim user ID-om

  // Uklonjeno trenutno jer nema limita
  // if (!dailyLimit.has(userId) || Date.now() - dailyLimit.get(userId).lastReset > DAY_MS) {
  //   dailyLimit.set(userId, { count: 0, lastReset: Date.now() });
  // }
  //
  // const userData = dailyLimit.get(userId);
  // if (userData.count >= MAX_FREE_VIDEOS) {
  //   return NextResponse.json({ success: false, error: "Limit od 3 videa dnevno premašen. Nadogradi na Pro!" }, { status: 403 });
  // }

  try {
    console.log('Pokrećem textToVideo sa promptom:', prompt);
    let videoBlob;
    try {
      videoBlob = await hf.textToVideo({
        model: 'genmo/mochi-1-preview',
        inputs: `${prompt}. Professional high-quality animation. Serbian business branding.`,
        parameters: { duration: 5, fps: 30, resolution: "480p" },
      });
    } catch (mochiError) {
      console.error('Mochi-1 error:', mochiError);
      console.log('Prebacujem se na wan-ai/wan2.2-t2v-5b');
      videoBlob = await hf.textToVideo({
        model: 'wan-ai/wan2.2-t2v-5b',
        inputs: `${prompt}. Professional high-quality animation. Serbian business branding.`,
        parameters: { duration: 5, fps: 30, resolution: "480p" },
      });
    }

    const arrayBuffer = await videoBlob.arrayBuffer();
    const base64Video = Buffer.from(arrayBuffer).toString('base64');
    const videoUrl = `data:video/mp4;base64,${base64Video}`;

    // Uklonjeno jer nema limita
    // userData.count += 1;
    console.log('Video uspešno generisan');
    return NextResponse.json({ success: true, videoUrl, message: "Video uspešno generisan!" });
  } catch (error) {
    console.error('AI Video Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška';
    return NextResponse.json({ success: false, error: 'Greška pri generisanju videa. Pokušajte ponovo. Detalji:', details: errorMessage }, { status: 500 });
  }
}
