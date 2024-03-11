import Footer from "../components/Footer";
import Terminal from "../components/Terminal";
import Window from "../components/Window";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default async function Home() {
    return (
        <div>
            <Window title="Terminal" label="">
                <SpeedInsights />
                <Terminal />
            </Window>
            <Footer />
        </div>
    );
}
