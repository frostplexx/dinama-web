// @ts-nocheck
"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import redS from "../../../assets/traffic-light-symbols/tl-red-symbol.svg";
import yellowS from "../../../assets/traffic-light-symbols/tl-yellow-symbol.svg";
import greenS from "../../../assets/traffic-light-symbols/tl-green-symbol.svg";

import * as s from "./styles.module.scss";

export default function TrafficLights({ onClose, onMinimize, onMaximize }) {
    const [hovering, setHovering] = useState(false);
    const router = useRouter();
    return (
        <div
            className={s.trafficLights}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div className={s.red} onClick={() => router.push("/")}>
                {hovering && <Image src={redS} width={7.5} height={7.5} alt="close button" />}
            </div>
            <div className={s.yellow} onClick={onMinimize}>
                {hovering && <Image src={yellowS} width={9.5} height={3} alt="minimize button" />}
            </div>
            <div className={s.green} onClick={onMaximize}>
                {hovering && <Image src={greenS} width={6} height={6} alt="maximize button" />}
            </div>
        </div>
    );
}
