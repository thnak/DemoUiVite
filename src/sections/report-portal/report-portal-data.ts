// ----------------------------------------------------------------------
// Report Portal Mock Data
// TypeScript interfaces and mock data for the Report Portal demo
// ----------------------------------------------------------------------

import type { IconifyName } from 'src/components/iconify/register-icons';

// Types for project status
export type ProjectStatus = 'all' | 'started' | 'approval' | 'completed';

// Types for project data
export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ProjectData {
  id: string;
  name: string;
  teamName: string;
  icon: IconifyName;
  iconColor: string;
  iconBgColor: string;
  timeRemaining: string;
  status: ProjectStatus;
  progress: number;
  teamMembers: TeamMember[];
}

// Types for status filter tabs
export interface StatusTab {
  value: ProjectStatus;
  label: string;
  count: number;
}

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

export const projectsData: ProjectData[] = [
  {
    id: '1',
    name: 'App Development',
    teamName: 'Marketing Team',
    icon: 'solar:monitor-smartphone-bold',
    iconColor: '#ffffff',
    iconBgColor: '#FF6B6B',
    timeRemaining: '1 Week Left',
    status: 'started',
    progress: 34,
    teamMembers: [
      { id: '1', name: 'Alex', avatarUrl: '/assets/images/avatar/avatar-1.webp' },
      { id: '2', name: 'Sarah', avatarUrl: '/assets/images/avatar/avatar-2.webp' },
      { id: '3', name: 'Mike', avatarUrl: '/assets/images/avatar/avatar-3.webp' },
    ],
  },
  {
    id: '2',
    name: 'Web Design',
    teamName: 'Core UI Team',
    icon: 'solar:layers-bold',
    iconColor: '#ffffff',
    iconBgColor: '#4ECDC4',
    timeRemaining: '3 Weeks Left',
    status: 'started',
    progress: 76,
    teamMembers: [
      { id: '4', name: 'John', avatarUrl: '/assets/images/avatar/avatar-4.webp' },
    ],
  },
  {
    id: '3',
    name: 'Landing Page',
    teamName: 'Marketing Team',
    icon: 'solar:code-square-bold',
    iconColor: '#ffffff',
    iconBgColor: '#45B7D1',
    timeRemaining: '2 Days Left',
    status: 'approval',
    progress: 4,
    teamMembers: [
      { id: '5', name: 'Emma', avatarUrl: '/assets/images/avatar/avatar-5.webp' },
      { id: '6', name: 'David', avatarUrl: '/assets/images/avatar/avatar-6.webp' },
      { id: '7', name: 'Lisa', avatarUrl: '/assets/images/avatar/avatar-7.webp' },
    ],
  },
  {
    id: '4',
    name: 'Business Compare',
    teamName: 'Marketing Team',
    icon: 'solar:chart-bold',
    iconColor: '#ffffff',
    iconBgColor: '#F4A261',
    timeRemaining: '1 Month Left',
    status: 'started',
    progress: 90,
    teamMembers: [
      { id: '8', name: 'Chris', avatarUrl: '/assets/images/avatar/avatar-8.webp' },
      { id: '9', name: 'Amy', avatarUrl: '/assets/images/avatar/avatar-9.webp' },
      { id: '10', name: 'Tom', avatarUrl: '/assets/images/avatar/avatar-10.webp' },
    ],
  },
  {
    id: '5',
    name: 'Commerce Checkout',
    teamName: 'Order Process Team',
    icon: 'solar:shopping-bag-bold',
    iconColor: '#ffffff',
    iconBgColor: '#2EC4B6',
    timeRemaining: '3 Weeks Left',
    status: 'started',
    progress: 65,
    teamMembers: [
      { id: '11', name: 'Ryan', avatarUrl: '/assets/images/avatar/avatar-11.webp' },
      { id: '12', name: 'Kate', avatarUrl: '/assets/images/avatar/avatar-12.webp' },
      { id: '13', name: 'Nick', avatarUrl: '/assets/images/avatar/avatar-13.webp' },
    ],
  },
  {
    id: '6',
    name: 'Data Staging',
    teamName: 'Core Data Team',
    icon: 'solar:folder-bold',
    iconColor: '#ffffff',
    iconBgColor: '#5E60CE',
    timeRemaining: '2 Months Left',
    status: 'approval',
    progress: 96,
    teamMembers: [
      { id: '14', name: 'James', avatarUrl: '/assets/images/avatar/avatar-14.webp' },
      { id: '15', name: 'Olivia', avatarUrl: '/assets/images/avatar/avatar-15.webp' },
      { id: '16', name: 'Lucas', avatarUrl: '/assets/images/avatar/avatar-16.webp' },
    ],
  },
  {
    id: '7',
    name: 'Campaign Store',
    teamName: 'Internal Communication',
    icon: 'solar:chat-round-dots-bold',
    iconColor: '#ffffff',
    iconBgColor: '#FF7B54',
    timeRemaining: '11 Days Left',
    status: 'approval',
    progress: 24,
    teamMembers: [
      { id: '17', name: 'Sophie', avatarUrl: '/assets/images/avatar/avatar-17.webp' },
      { id: '18', name: 'Daniel', avatarUrl: '/assets/images/avatar/avatar-18.webp' },
      { id: '19', name: 'Emily', avatarUrl: '/assets/images/avatar/avatar-19.webp' },
    ],
  },
  {
    id: '8',
    name: 'Acquisition Mitra',
    teamName: 'Merchant Team',
    icon: 'solar:people-nearby-bold',
    iconColor: '#ffffff',
    iconBgColor: '#9B5DE5',
    timeRemaining: '1 Week Left',
    status: 'completed',
    progress: 70,
    teamMembers: [
      { id: '20', name: 'Anna', avatarUrl: '/assets/images/avatar/avatar-20.webp' },
    ],
  },
];

// Get status tabs with counts
export function getStatusTabs(projects: ProjectData[]): StatusTab[] {
  const allCount = projects.length;
  const startedCount = projects.filter((p) => p.status === 'started').length;
  const approvalCount = projects.filter((p) => p.status === 'approval').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;

  return [
    { value: 'all', label: 'All', count: allCount },
    { value: 'started', label: 'Started', count: startedCount },
    { value: 'approval', label: 'Approval', count: approvalCount },
    { value: 'completed', label: 'Completed', count: completedCount },
  ];
}

// Filter projects by status
export function filterProjectsByStatus(
  projects: ProjectData[],
  status: ProjectStatus
): ProjectData[] {
  if (status === 'all') {
    return projects;
  }
  return projects.filter((p) => p.status === status);
}
