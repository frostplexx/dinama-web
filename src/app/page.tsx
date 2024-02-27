import Image from "next/image";

import HomeView from "../components/HomeView";
import Window from "../components/Window";

import styles from "./page.module.css";

export default function Home() {
    return (
        <div>
            <Window title="Terminal" label="">
                <HomeView />
            </Window>
        </div>
    );
}
