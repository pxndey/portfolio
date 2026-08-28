import './Tools.css'

interface ToolGroup {
  groupName: string
  tools: string[]
}

interface ToolsProps {
  portfolioData: {
    toolGroups: ToolGroup[]
  }
}

function Tools({ portfolioData }: ToolsProps) {
  const groups = portfolioData.toolGroups ?? []

  return (
    <div className="tools-page">
      <p className="page-eyebrow">Toolbox</p>
      <h1>Tools</h1>
      <p className="page-desc">
        Languages, libraries, and the infrastructure I reach for day to day — across
        machine learning, web, and whatever the server room throws at me.
      </p>

      {groups.length === 0 ? (
        <p className="page-desc">No tools defined yet.</p>
      ) : (
        <div className="tools-sections">
          {groups.map((group) => (
            <section key={group.groupName} className="tools-section">
              <h2 className="tools-section-title">{group.groupName}</h2>
              <ul className="tools-list">
                {group.tools.map((tool) => (
                  <li key={tool} className="tools-item">
                    {tool}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tools