// ----------------------------------------------------------------------
// Project Dashboard Mock Data
// TypeScript interfaces and mock data for the Project Management Dashboard
// ----------------------------------------------------------------------

// Types for project stats
export interface ProjectStatsData {
  id: string;
  title: string;
  value: number;
  subtitle: string;
  variant: 'primary' | 'default';
}

// Types for project analytics (weekly bar chart)
export interface WeeklyAnalyticsData {
  day: string;
  value: number;
}

// Types for reminders
export interface ReminderData {
  id: string;
  title: string;
  time: string;
}

// Types for project task
export interface ProjectTaskData {
  id: string;
  title: string;
  dueDate: string;
  icon: string;
  color: 'success' | 'warning' | 'error' | 'info' | 'primary';
}

// Types for team member
export interface TeamMemberData {
  id: string;
  name: string;
  avatarUrl: string;
  task: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

// Types for project progress
export interface ProjectProgressData {
  completed: number;
  inProgress: number;
  pending: number;
}

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

export const projectStatsData: ProjectStatsData[] = [
  {
    id: '1',
    title: 'Total Projects',
    value: 24,
    subtitle: 'Increased from last month',
    variant: 'primary',
  },
  {
    id: '2',
    title: 'Ended Projects',
    value: 10,
    subtitle: 'Increased from last month',
    variant: 'default',
  },
  {
    id: '3',
    title: 'Running Projects',
    value: 12,
    subtitle: 'Increased from last month',
    variant: 'default',
  },
  {
    id: '4',
    title: 'Pending Project',
    value: 2,
    subtitle: 'On Discuss',
    variant: 'default',
  },
];

export const weeklyAnalyticsData: WeeklyAnalyticsData[] = [
  { day: 'S', value: 20 },
  { day: 'M', value: 60 },
  { day: 'T', value: 50 },
  { day: 'W', value: 80 },
  { day: 'T', value: 45 },
  { day: 'F', value: 35 },
  { day: 'S', value: 25 },
];

export const remindersData: ReminderData[] = [
  {
    id: '1',
    title: 'Meeting with Arc Company',
    time: '02.00 pm - 04.00 pm',
  },
];

export const projectTasksData: ProjectTaskData[] = [
  {
    id: '1',
    title: 'Develop API Endpoints',
    dueDate: 'Nov 26, 2024',
    icon: 'solar:code-bold',
    color: 'success',
  },
  {
    id: '2',
    title: 'Onboarding Flow',
    dueDate: 'Nov 28, 2024',
    icon: 'solar:user-plus-bold',
    color: 'warning',
  },
  {
    id: '3',
    title: 'Build Dashboard',
    dueDate: 'Nov 30, 2024',
    icon: 'solar:chart-square-bold',
    color: 'success',
  },
  {
    id: '4',
    title: 'Optimize Page Load',
    dueDate: 'Dec 5, 2024',
    icon: 'solar:bolt-bold',
    color: 'warning',
  },
  {
    id: '5',
    title: 'Cross-Browser Testing',
    dueDate: 'Dec 6, 2024',
    icon: 'solar:monitor-bold',
    color: 'warning',
  },
];

export const teamMembersData: TeamMemberData[] = [
  {
    id: '1',
    name: 'Alexandra Deff',
    avatarUrl: '/assets/images/avatar/avatar-1.webp',
    task: 'Github Project Repository',
    status: 'Completed',
  },
  {
    id: '2',
    name: 'Edwin Adenike',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    task: 'Integrate User Authentication System',
    status: 'In Progress',
  },
  {
    id: '3',
    name: 'Isaac Oluwatemilorun',
    avatarUrl: '/assets/images/avatar/avatar-3.webp',
    task: 'Develop Search and Filter Functionality',
    status: 'Pending',
  },
  {
    id: '4',
    name: 'David Oshodi',
    avatarUrl: '/assets/images/avatar/avatar-4.webp',
    task: 'Responsive Layout for Homepage',
    status: 'In Progress',
  },
];

export const projectProgressData: ProjectProgressData = {
  completed: 41,
  inProgress: 35,
  pending: 24,
};
