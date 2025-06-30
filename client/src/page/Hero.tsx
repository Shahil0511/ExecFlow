import { AuthSection } from "@/customcomponents/Auth"
import { HeroSection } from "@/customcomponents/HeroComponents"
import { useState } from "react"

export default function App() {
    const [showAuth, setShowAuth] = useState(false)

    return (
        <div>
            {!showAuth ? (
                <HeroSection onGetStarted={() => setShowAuth(true)} />
            ) : (
                <AuthSection onBack={() => setShowAuth(false)} />
            )}
        </div>
    )
}