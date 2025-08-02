import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';
import * as dotenv from 'dotenv';
dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
const dailyLimit = new Map(); // Promenjeno sa let na const
const MAX_FREE_VIDEOS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const { prompt } = await request.json(); // Uklonjen imageBase64 jer se ne koristi
  const userId = "user123"; // Zameni sa stvarnim user ID-om (npr. Supabase)

  if (!dailyLimit.has(userId) || Date.now() - dailyLimit.get(userId).lastReset > DAY_MS) {
    dailyLimit.set(userId, { count: 0, lastReset: Date.now() });
  }

  const userData = dailyLimit.get(userId);
  if (userData.count >= MAX_FREE_VIDEOS) {
    return NextResponse.json({ success: false, error: "Limit od 3 videa dnevno premašen. Nadogradi na Pro!" }, { status: 403 });
  }

  try {
    const videoBlob = await hf.textToVideo({
      model: 'genmo/mochi-1-preview',
      inputs: `${prompt}. Professional high-quality animation. Serbian business branding.`,
      parameters: { duration: 5, fps: 30, resolution: "480p" },
    });

    const arrayBuffer = await videoBlob.arrayBuffer();
    const base64Video = Buffer.from(arrayBuffer).toString('base64');
    const videoUrl = `data:video/mp4;base64,${base64Video}`; // Inline base64 umesto simulacije

    userData.count += 1;
    return NextResponse.json({ success: true, videoUrl, message: "Video uspešno generisan!" });
  } catch (error) {
    console.error('AI Video Generation Error:', error);
    return NextResponse.json({ success: false, error: 'Greška pri generisanju videa. Pokušajte ponovo.' }, { status: 500 });
  }
}
