import { NextResponse } from 'next/server';

let dailyLimit = new Map();
const MAX_FREE_VIDEOS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const { imageBase64, prompt } = await req.json();
  const userId = "user123"; // Zameni sa stvarnim user ID-om (npr. Supabase)

  if (!dailyLimit.has(userId) || Date.now() - dailyLimit.get(userId).lastReset > DAY_MS) {
    dailyLimit.set(userId, { count: 0, lastReset: Date.now() });
  }

  const userData = dailyLimit.get(userId);
  if (userData.count >= MAX_FREE_VIDEOS) {
    return NextResponse.json({ success: false, error: "Limit od 3 videa dnevno premašen. Nadogradi na Pro!" }, { status: 403 });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/genmo/mochi-1-preview', {
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: `${prompt}. Professional Serbian animation, 480p, 5 seconds.`,
        parameters: { num_frames: 150, fps: 30, height: 480, width: 848 },
      }),
    });

    if (!response.ok) throw new Error('Greška sa Hugging Face API-jem');

    const videoBlob = await response.blob();
    const arrayBuffer = await videoBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Simulacija S3 URL-a (za sada lokalni)
    const videoUrl = `/api/video/${Date.now()}.mp4`; // Zameni sa S3 URL-om
    userData.count += 1;
    return NextResponse.json({ success: true, videoUrl });
  } catch (error) {
    console.error('Greška:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
