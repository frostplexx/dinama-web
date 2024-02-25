import "./styles.scss";

export default function HomeView() {
    return (
        <div id="terminal-body" className="selectable">
            <p>
                <span className="location">me@portfolio:</span>
                <span className="location2">~ $</span> cat hello.txt
            </p>
            <p className="subtext">
                Hello there! Welcome to my website where I showcase some of my projects and fun ideas.
                Browse through the files to discover more about my work. If you have any questions or just
                want to chat, feel free to reach out. Enjoy your time here!
            </p>
            <div className="spacer"></div>
            <p>
                <span className="location">me@portfolio:</span>
                <span className="location2">~ $</span> cd projects/ &amp;&amp; ls
            </p>
            <div id="projects">
                <div className="project">
                    <a href="https://github.com/lo-cafe/winston">
                        Winston -- A beautiful and native Reddit client for iOS
                    </a>
                </div>
                <div className="project">
                    <a href="https://github.com/Frostplexx/obsidian-github-issues">
                        obsidian-github-issues -- Embed GitHub issues in your Obsidian notes!
                    </a>
                </div>
                <div className="project">
                    <a href="https://github.com/Frostplexx/BinaryTools">
                        BinaryTools -- A raycast calculator plugin for binary, decimal, hex and octal numbers.
                        <d-s></d-s>
                    </a>
                </div>
                <div className="project">
                    <a href="https://github.com/Frostplexx/discord-one-dark">
                        Discord One Dark -- The bevoled One Dark Atom theme brought to Discord
                    </a>
                </div>
                <div className="project">
                    <a href="./playground/playground.html">Playgound -- A playground for testing things</a>
                </div>
            </div>
            <div className="spacer"></div>
            <p>
                <span className="location">me@portfolio:</span>
                <span className="location2">~/projects $</span> cd ..
            </p>
            <p>
                <span className="location">me@portfolio:</span>
                <span className="location2">~ $</span> cd socials/ &amp;&amp; ls
            </p>
            <div className="socials">
                <a href="https://github.com/Frostplexx">GitHub</a>
                <a href="mailto:me@dinama.dev">me@dinama.dev</a>
                <span>Frostplexx.discord</span>
            </div>
        </div>
    );
}







