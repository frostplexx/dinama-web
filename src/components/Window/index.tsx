'use server';
// import { useRef } from 'react';
import { Suspense } from "react";
import cs from "classnames";
import Link from "next/link";

import TrafficLights from "./TrafficLights";
import * as s from "./styles.module.scss";

export default async function Window({ title, label, children }) {
    return (
        <div className={s.wrapper}>
            <Link href="/">
                <div className={s.clickableBG} />
            </Link>
            <div className={s.window}>
                <div className={s.blurBG} />
                <div className={s.surfaceLight} />
                <div className={s.border} />

                <div className={s.titleBarWrapper}>
                    <div className={cs(s.titleBar, "flex between")}>
                        <div className="flex left gap16">
                            <TrafficLights />
                            <div className="shadow16">{title}</div>
                        </div>
                        {!!label && <div className={s.label}>{label}</div>}
                    </div>
                    <div className={s.divider} />
                </div>
                <div className={s.content}>{children}</div>
            </div>
        </div>
    );
}
