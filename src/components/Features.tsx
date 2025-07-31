// src/components/Features.tsx
export default function Features() {
  const features = [
    { title: 'Besplatna generacija', description: '5 videa dnevno bez troškova!' },
    { title: 'Brza obrada', description: 'Video u 60 sekundi!' },
    { title: 'Lokalna podrška', description: 'Na srpskom jeziku za tebe!' },
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-center mb-8">Zašto Gde-Kako.rs?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="p-6 bg-black/30 rounded-lg border border-white/10">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
