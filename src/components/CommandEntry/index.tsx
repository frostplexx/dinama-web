"use client";
import { useRef, useEffect, useState, SetStateAction } from "react";
import AutosizeInput from "react-input-autosize";

import CommandEntry, { CommandEntryProps } from "./CommandEntry";
import { parseCommand } from "./terminal/command-prompt";
import "./styles.scss";

export default function CommandPrompt() {
    const [log, setLog] = useState<CommandEntryProps[]>([]);
    const [command, setCommand] = useState("");
    const [currentLocation, setCurrentLocation] = useState("~");
    const inputRef = useRef<HTMLInputElement>(null);
    const dumbBottomRef = useRef(null);

    function scrollDown() {
        if (dumbBottomRef.current) {
            dumbBottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    function focusOnInput() {
        setTimeout(() => inputRef.current?.focus(), 200);
    };

    const handleFormSubmit = (e: any) => {
        e.preventDefault();

        //Handle clear command separately
        if (command == "clear") {
            setCommand("")
            setLog([])
            return
        }

        const { response, location: newLocation } = parseCommand(command);
        const newCommandEntry = {
            children: command,
            location: currentLocation,
            result: response,
        };
        setLog((old) => [...old, newCommandEntry]);
        setCurrentLocation(newLocation);
        setCommand("");
    };


    // Use useEffect to focus the input element after the component mounts
    useEffect(focusOnInput, []); // The empty array ensures this effect runs only once after the initial render
    useEffect(scrollDown, [log, scrollDown]); // The empty array ensures this effect runs only once after the initial render

    return (
        <>
            {log.map((entry, index) => (
                <CommandEntry key={index} {...entry} />
            ))}
            <form className="terminalInputForm" onSubmit={handleFormSubmit}>
                <CommandEntry location={currentLocation}>
                    <div className="terminalInput" onClick={focusOnInput}>
                        <AutosizeInput
                            ref={inputRef}
                            type="text"
                            value={command}
                            onBlur={focusOnInput}
                            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setCommand(e.target.value)}
                        />
                    </div>
                </CommandEntry>
            </form>
            <div ref={dumbBottomRef} style={{ display: "block", width: "100%", height: "1px" }} />
        </>
    );
}
