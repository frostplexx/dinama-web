export interface CommandEntryProps {
    children: React.ReactNode;
    location: string;
    result?: string;
}

export default function CommandEntry({ children, location, result }: CommandEntryProps) {

    function parseLocation(currentLocation: string): string {
        if (currentLocation == "" || !currentLocation) {
            return "/"
        } else {
            return "/" + currentLocation.replaceAll("home/daniel", "~")
        }
    }


    return (
        // This classes are defined in /src/styles/globals.scss
        <>
            <div className="flex gap8">
                <div className="flex">
                    <span className="location">daniel@portfolio:</span>
                    <span className="location2">{parseLocation(location)} $</span>
                </div>
                <div className="fill">{children}</div>
            </div>
            {!!result && <div className="preseveNewLines">{result}</div>}
        </>
    );
}
