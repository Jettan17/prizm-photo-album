export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Prizm</h1>
        <p className="text-neutral-400">Photo Album</p>
      </header>

      <div className="text-center text-neutral-500">
        <p>Add your photos to <code className="bg-neutral-800 px-2 py-1 rounded">/public/photos/</code></p>
        <p className="mt-2">Then run <code className="bg-neutral-800 px-2 py-1 rounded">npm run dev</code></p>
      </div>
    </main>
  );
}
