import Navigation from "@/components/navigation";

export default function About() {
  return (
    <main className="min-h-screen p-8">
      <Navigation />
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-4">This is the about page.</p>
      </div>
    </main>
  );
}
