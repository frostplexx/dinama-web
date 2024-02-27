'use client';
import { useEffect, useState } from "react";
import CommandPrompt from "./CommandPrompt";
import Project from "./Project";
import "./styles.scss";
import { parseCommand, CommmandResponse } from "../../terminal/command-prompt";

export default function HomeView() {

    const [commandOutputs, setCommandOutputs] = useState<CommmandResponse[]>([]);


    // Use useEffect to focus the input element after the component mounts
    useEffect(() => {
        const inputElement = document.querySelector('.terminalInput');
        console.log(inputElement)
        if (inputElement) {
            (inputElement as any).focus();
        }
    }, []); // The empty array ensures this effect runs only once after the initial render

    const handleFocus = (el: any) => {
        setTimeout(function() {
            el.target.focus();
        }, 201);
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            if (event.target.value == "clear") {
                setCommandOutputs([])
            } else {
                setCommandOutputs(prev => [...prev, command]);
                const command = parseCommand(event.target.value);
            }
            event.preventDefault(); // Prevent the form from being submitted
            // Clear the input after submitting
            event.target.value = '';
        }
    };


    function parseLocation(commandOutputs: CommmandResponse[]): string {
        if (commandOutputs.length == 0) {
            return "~"
        } else if (commandOutputs.length > 1) {
            return "/" + commandOutputs[commandOutputs.length - 1].position.replaceAll("home/daniel", "~")
        } else {
            return "/" + commandOutputs[0].position.replaceAll("home/daniel", "~")
        }
    }

    return (
        <div id="terminal-body" className="selectable">
            <CommandPrompt command={"cat hello.txt"} location={"~"} />
            <p className="subtext">
                Hello there! Welcome to my website where I showcase some of my projects and fun ideas.
                Browse through the files to discover more about my work. If you have any questions or just
                want to chat, feel free to reach out. Enjoy your time here!
            </p>
            <div className="spacer"></div>
            <CommandPrompt command={"cd projects/ && ls"} location={"~"} />
            <div id="projects">
                <Project name={"Winston"} description={"A beautiful and native Reddit client for iOS"} href={"https://github.com/lo-cafe/winston"} />
                <Project name={"obsidian-github-issues"} description={"Embed GitHub issues in your Obsidian notes!"} href={"https://github.com/Frostplexx/obsidian-github-issues"} />
                <Project name={"Binary Tools"} description={"A raycast calculator plugin for binary, decimal, hex and octal numbers"} href={"https://github.com/Frostplexx/BinaryTools"} />
                <Project name={"Discord One Dark"} description={"The bevoled One Dark Atom theme brought to Discord"} href={"https://github.com/Frostplexx/discord-one-dark"} />
                <Project name={"Playground"} description={"A playground for testing things"} href={"./playgroung/playground.html"} />
            </div>
            <div className="spacer"></div>
            <CommandPrompt command={"cd .."} location={"/projects"} />
            <CommandPrompt command={"cd socials/ && ls"} location={"~"} />
            <div className="socials">
                <a href="https://github.com/Frostplexx">GitHub</a>
                <a href="mailto:me@dinama.dev">me@dinama.dev</a>
                <span>Frostplexx.discord</span>
            </div>
            {commandOutputs.map((commandOutput, index) => (
                <div key={index}>{commandOutput.result}</div>
            ))}
            <CommandPrompt command={
                <input className="terminalInput" type="text" onBlur={handleFocus} onKeyDown={handleKeyDown} />
            } location={parseLocation(commandOutputs)} />
        </div>
    );
}
