import "./styles.scss";

export default function CommandPrompt({ command, location }) {
    return (
        <p>
            <span className="location">me@portfolio:</span>
            <span className="location2">~{location} $</span> {command}
        </p>
    )
}
