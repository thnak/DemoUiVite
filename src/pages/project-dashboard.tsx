import { CONFIG } from 'src/config-global';

import { ProjectDashboardView } from 'src/sections/project-dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Project Dashboard - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Project management dashboard to plan, prioritize, and accomplish your tasks with ease"
      />
      <meta name="keywords" content="project,dashboard,tasks,team,collaboration,progress" />

      <ProjectDashboardView />
    </>
  );
}
