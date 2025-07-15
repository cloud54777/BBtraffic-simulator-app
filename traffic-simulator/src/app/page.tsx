import TrafficSimulator from "@/components/TrafficSimulator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto py-8">
        <TrafficSimulator />
      </div>
    </main>
  )
}
