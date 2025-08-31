import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ProjectHealthBadge from "./ProjectHealthBadge"

const ProjectRow = ({ project }) => {
  const [projectData, setProjectData] = useState(project)
  const navigate = useNavigate()

  const handleHealthChange = (newHealth) => {
    const updatedProject = { ...projectData, health: newHealth }
    setProjectData(updatedProject)
    console.log(`Project ${projectData.name} health changed to: ${newHealth}`)
  }

  const handleRowClick = () => {
    navigate(`/projects/${projectData.id}`) // redirects to details page
  }

  return (
    <tr
      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
      onClick={handleRowClick}
    >
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {projectData.name}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-700">{projectData.owner}</td>
      <td className="px-6 py-4">
        <ProjectHealthBadge
          health={projectData.health}
          healthColor={projectData.healthColor}
          onHealthChange={handleHealthChange}
        />
      </td>
      <td className="px-6 py-4 text-gray-700">{projectData.startDate}</td>
      <td className="px-6 py-4 text-gray-700">{projectData.endDate}</td>
    </tr>
  )
}

export default ProjectRow
