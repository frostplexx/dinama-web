import "./styles.scss"

export default function Project({ name, description, href }) {
    return (
        <div className="project">
            <a href={href} aria-label={name}>
                {name} -- {description}
            </a>
        </div>
    )
}
