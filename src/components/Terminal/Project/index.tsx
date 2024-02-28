import "./styles.scss"

export default function Project({ name, description, href }) {
    return (
        <div className="project">
            <a href={href}>
                {name} -- {description}
            </a>
        </div>
    )
}
