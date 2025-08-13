import ProjectsHeader from "./ProjectsHeader"
import ProjectsTable from "./ProjectsTable"

const ProjectsView = ({ projects, onCreateProject }) => {
  return (
    <div className="space-y-6">
      <ProjectsHeader projectCount={projects.length} onCreateProject={onCreateProject} />
      <ProjectsTable projects={projects} />
    </div>
  )
}

export default ProjectsView
