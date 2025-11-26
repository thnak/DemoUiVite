// ----------------------------------------------------------------------
// File Dashboard Mock Data
// TypeScript interfaces and mock data for the File Dashboard demo
// ----------------------------------------------------------------------

import type { IconifyName } from 'src/components/iconify/register-icons';

// Types for storage providers
export interface StorageProvider {
  id: string;
  name: string;
  icon: IconifyName;
  usedStorage: number; // in GB
  totalStorage: number; // in GB
  color: string;
}

// Types for data activity chart
export interface DataActivityYear {
  year: string;
  images: number;
  media: number;
  documents: number;
  other: number;
}

// Types for folders
export interface FolderData {
  id: string;
  name: string;
  size: number; // in MB
  fileCount: number;
  isFavorite: boolean;
  collaborators: { id: string; avatarUrl: string }[];
}

// Types for recent files
export interface RecentFile {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video' | 'document';
  size: number; // in MB
  date: string;
  collaborators: { id: string; avatarUrl: string }[];
  isFavorite: boolean;
}

// Types for storage usage
export interface StorageCategory {
  id: string;
  name: string;
  icon: IconifyName;
  color: string;
  size: number; // in GB
  fileCount: number;
}

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

export const storageProvidersData: StorageProvider[] = [
  {
    id: '1',
    name: 'Dropbox',
    icon: 'logos:dropbox',
    usedStorage: 2.24,
    totalStorage: 22.35,
    color: '#0061FF',
  },
  {
    id: '2',
    name: 'Drive',
    icon: 'logos:google-drive',
    usedStorage: 4.47,
    totalStorage: 22.35,
    color: '#FBBC04',
  },
  {
    id: '3',
    name: 'OneDrive',
    icon: 'logos:microsoft-onedrive',
    usedStorage: 11.18,
    totalStorage: 22.35,
    color: '#0078D4',
  },
];

export const dataActivityData: DataActivityYear[] = [
  { year: '2018', images: 50, media: 30, documents: 20, other: 10 },
  { year: '2019', images: 80, media: 50, documents: 40, other: 20 },
  { year: '2020', images: 60, media: 50, documents: 40, other: 30 },
  { year: '2021', images: 180, media: 80, documents: 60, other: 40 },
  { year: '2022', images: 180, media: 100, documents: 70, other: 50 },
  { year: '2023', images: 100, media: 50, documents: 40, other: 30 },
];

export const foldersData: FolderData[] = [
  {
    id: '1',
    name: 'Docs',
    size: 2293.76, // 2.24 GB in MB
    fileCount: 100,
    isFavorite: true,
    collaborators: [
      { id: '1', avatarUrl: '/assets/images/avatar/avatar-1.webp' },
      { id: '2', avatarUrl: '/assets/images/avatar/avatar-2.webp' },
    ],
  },
  {
    id: '2',
    name: 'Projects',
    size: 1146.88, // 1.12 GB in MB
    fileCount: 200,
    isFavorite: true,
    collaborators: [
      { id: '1', avatarUrl: '/assets/images/avatar/avatar-3.webp' },
      { id: '2', avatarUrl: '/assets/images/avatar/avatar-4.webp' },
    ],
  },
  {
    id: '3',
    name: 'Work',
    size: 762.94,
    fileCount: 300,
    isFavorite: false,
    collaborators: [
      { id: '1', avatarUrl: '/assets/images/avatar/avatar-5.webp' },
      { id: '2', avatarUrl: '/assets/images/avatar/avatar-6.webp' },
    ],
  },
  {
    id: '4',
    name: 'Training',
    size: 572.2,
    fileCount: 400,
    isFavorite: false,
    collaborators: [{ id: '1', avatarUrl: '/assets/images/avatar/avatar-7.webp' }],
  },
];

export const recentFilesData: RecentFile[] = [
  {
    id: '1',
    name: 'cover-2.jpg',
    type: 'image',
    size: 45.78,
    date: '26 Nov 2025 9:24 am',
    collaborators: [
      { id: '1', avatarUrl: '/assets/images/avatar/avatar-1.webp' },
      { id: '2', avatarUrl: '/assets/images/avatar/avatar-2.webp' },
    ],
    isFavorite: true,
  },
  {
    id: '2',
    name: 'design-suriname-2015.mp3',
    type: 'audio',
    size: 22.89,
    date: '25 Nov 2025 8:24 am',
    collaborators: [
      { id: '1', avatarUrl: '/assets/images/avatar/avatar-3.webp' },
      { id: '2', avatarUrl: '/assets/images/avatar/avatar-4.webp' },
    ],
    isFavorite: true,
  },
];

export const storageCategoriesData: StorageCategory[] = [
  {
    id: '1',
    name: 'Images',
    icon: 'solar:gallery-bold',
    color: '#00AB55',
    size: 11.18,
    fileCount: 223,
  },
  {
    id: '2',
    name: 'Media',
    icon: 'solar:play-circle-bold',
    color: '#FF5630',
    size: 4.47,
    fileCount: 223,
  },
  {
    id: '3',
    name: 'Documents',
    icon: 'solar:document-bold',
    color: '#FFAB00',
    size: 4.47,
    fileCount: 223,
  },
  {
    id: '4',
    name: 'Other',
    icon: 'solar:folder-bold',
    color: '#919EAB',
    size: 2.24,
    fileCount: 223,
  },
];

// Total storage stats
export const totalStorageData = {
  used: 22.35,
  total: 44.7,
  usedPercentage: 76,
};
