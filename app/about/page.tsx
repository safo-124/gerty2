import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">About Our Academy</h1>
        
        <Card className="p-8 glass mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg opacity-80 leading-relaxed">
            We believe chess is more than a game—its a tool for developing critical thinking, 
            strategic planning, and mental resilience. Our academy combines world-class chess 
            education with a commitment to social impact.
          </p>
        </Card>

        <Card className="p-8 glass mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Charity Initiative</h2>
          <p className="text-lg opacity-80 leading-relaxed">
            Every enrollment and donation supports our NGO mission to bring chess education 
            to underserved communities around the world. We provide free lessons, equipment, 
            and tournament opportunities to children who wouldnt otherwise have access.
          </p>
        </Card>

        <Card className="p-8 glass">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-lg opacity-80 leading-relaxed">
            Founded in 2020, our academy has grown from a small local initiative to a global 
            platform serving thousands of students. Our team of Grandmasters and International 
            Masters is dedicated to nurturing the next generation of chess champions while 
            making a positive impact on society.
          </p>
        </Card>
      </div>
    </div>
  )
}
