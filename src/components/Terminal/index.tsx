import { Suspense } from "react";

import CommandPrompt from "../CommandEntry";
import CommandEntry from "../CommandEntry/CommandEntry";

import Project from "./Project";
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
                <Project
                    name={"Winston"}
                    description={"A beautiful and native Reddit client for iOS"}
                    href={"https://github.com/lo-cafe/winston"}
                />
                <Project
                    name={"obsidian-github-issues"}
                    description={"Embed GitHub issues in your Obsidian notes!"}
                    href={"https://github.com/Frostplexx/obsidian-github-issues"}
                />
                <Project
                    name={"Binary Tools"}
                    description={
                        "A raycast calculator plugin for binary, decimal, hex and octal numbers"
                    }
                    href={"https://github.com/Frostplexx/BinaryTools"}
                />
                <Project
                    name={"Discord One Dark"}
                    description={"The bevoled One Dark Atom theme brought to Discord"}
                    href={"https://github.com/Frostplexx/discord-one-dark"}
                />
                <Project
                    name={"Playground"}
                    description={"A playground for testing things"}
                    href={"https://playground.dinama.dev"}
                />
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
