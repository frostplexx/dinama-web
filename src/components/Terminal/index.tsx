import { Suspense, useEffect, useState } from "react";
import CommandPrompt from "../CommandEntry";
import CommandEntry from "../CommandEntry/CommandEntry";

import "./styles.scss";

export default async function Terminal() {

    return (
        <div id="terminal-body" className="selectable">
            <CommandEntry location={"~"}>cat hello.txt</CommandEntry>
            <p className="subtext">
                Hello there! Welcome to my website where I showcase some of my projects and fun
                ideas. Browse through the files to discover more about my work. If you have any
                questions or just want to chat, feel free to reach out. Enjoy your time here!
            </p>
            <div className="spacer"></div>
            <CommandEntry location={"~"}>cd projects/ && ls.</CommandEntry>
            <div id="projects">
            </div>
            <div className="spacer"></div>
            <CommandEntry location={"~/projects"}>cd ..</CommandEntry>
            <CommandEntry location={"~"}>cd socials/ && ls</CommandEntry>
            <div className="socials">
                <a href="https://github.com/Frostplexx">GitHub</a>
                <a href="mailto:me@dinama.dev">me@dinama.dev</a>
                <span>Frostplexx.discord</span>
            </div>
            <Suspense fallback={null}>
                <CommandPrompt />
            </Suspense>
        </div>
    );
}


