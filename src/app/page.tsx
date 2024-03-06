import Terminal from "../components/Terminal";
import Window from "../components/Window";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default async function Home() {
    return (
        <Window title="Terminal" label="">
            <SpeedInsights />
            <Terminal />
        </Window>
    );
}
