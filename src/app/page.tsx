// src/app/page.tsx
import VideoGenerator from '@/components/VideoGenerator';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function Home() {
  return (
    <div>
      <Hero />
      <VideoGenerator />
      <Features />
    </div>
  );
}
