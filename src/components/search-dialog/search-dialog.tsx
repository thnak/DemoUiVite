import type { PageMetadata } from 'src/config/page-metadata';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';

import { Iconify } from 'src/components/iconify';

import { usePageSearch } from './use-page-search';

// ----------------------------------------------------------------------

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    results,
    popularPages,
    suggestions,
    addToHistory,
    clearHistory,
    currentLanguage,
  } = usePageSearch();

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]); // Use results.length to track changes

  // Handle navigation
  const handleNavigate = useCallback(
    (page: PageMetadata) => {
      addToHistory(query);
      navigate(page.path);
      onClose();
    },
    [addToHistory, navigate, onClose, query]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const displayedResults = query.trim() ? results : suggestions.length > 0 ? suggestions : popularPages;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % displayedResults.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + displayedResults.length) % displayedResults.length);
      } else if (event.key === 'Enter' && displayedResults[selectedIndex]) {
        event.preventDefault();
        handleNavigate(displayedResults[selectedIndex]);
      }
    },
    [query, results, suggestions, popularPages, selectedIndex, handleNavigate]
  );

  // Handle copy URL
  const handleCopyUrl = useCallback(
    (path: string, event: React.MouseEvent) => {
      event.stopPropagation();
      const fullUrl = `${window.location.origin}${path}`;
      navigator.clipboard.writeText(fullUrl);
    },
    []
  );

  // Category filters
  const categories = [
    { value: 'all', label: { en: 'All', vi: 'Tất cả' } },
    { value: 'dashboard', label: { en: 'Dashboard', vi: 'Bảng Điều Khiển' } },
    { value: 'master-data', label: { en: 'Master Data', vi: 'Dữ Liệu Chính' } },
    { value: 'user-management', label: { en: 'User Management', vi: 'Quản Lý Người Dùng' } },
    { value: 'settings', label: { en: 'Settings', vi: 'Cài Đặt' } },
    { value: 'mms', label: { en: 'MMS', vi: 'MMS' } },
    { value: 'oi', label: { en: 'OI', vi: 'OI' } },
  ];

  // Render search result item
  const renderResultItem = (page: PageMetadata, index: number) => (
    <ListItem key={page.path} disablePadding>
      <ListItemButton
        selected={index === selectedIndex}
        onClick={() => handleNavigate(page)}
        sx={{
          py: 2,
          px: 3,
          borderRadius: 1,
          '&.Mui-selected': {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs separator="›" sx={{ mb: 0.5 }}>
            {page.breadcrumbs[currentLanguage].map((crumb, i) => (
              <Typography
                key={i}
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                }}
              >
                {crumb}
              </Typography>
            ))}
          </Breadcrumbs>

          {/* Page Title */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              color: 'text.primary',
            }}
          >
            {page.title[currentLanguage]}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {page.description[currentLanguage]}
          </Typography>

          {/* Page Sections */}
          {page.sections && page.sections.length > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
              {page.sections.slice(0, 3).map((section) => (
                <Chip
                  key={section.id}
                  label={section.title[currentLanguage]}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Copy URL Button */}
        <IconButton
          size="small"
          onClick={(e) => handleCopyUrl(page.path, e)}
          sx={{
            ml: 1,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <Iconify icon="solar:copy-linear" width={18} />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );

  // Display content based on search state
  const displayedResults = query.trim() ? results : suggestions.length > 0 ? suggestions : popularPages;
  const sectionTitle = query.trim()
    ? t('Search Results')
    : suggestions.length > 0
      ? t('Recent Searches')
      : t('Popular Pages');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          overflow: 'hidden',
          maxHeight: '80vh',
        },
      }}
    >
      {/* Search Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            placeholder={currentLanguage === 'en' ? 'Search pages...' : 'Tìm kiếm trang...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" width={24} />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setQuery('')}>
                      <Iconify icon="eva:close-fill" width={20} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.neutral',
              },
            }}
          />
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        {/* Category Filters */}
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category.value}
              label={category.label[currentLanguage]}
              onClick={() => setSelectedCategory(category.value)}
              color={selectedCategory === category.value ? 'primary' : 'default'}
              variant={selectedCategory === category.value ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Stack>
      </Box>

      <Divider />

      {/* Results Section */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
        {displayedResults.length > 0 ? (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {sectionTitle} ({displayedResults.length})
              </Typography>
              {suggestions.length > 0 && !query.trim() && (
                <Button size="small" onClick={clearHistory} color="error">
                  {currentLanguage === 'en' ? 'Clear History' : 'Xóa Lịch Sử'}
                </Button>
              )}
            </Stack>
            <List disablePadding>
              {displayedResults.map((page, index) => renderResultItem(page, index))}
            </List>
          </>
        ) : (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Iconify icon="eva:search-outline" width={64} sx={{ mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {currentLanguage === 'en' ? 'No results found' : 'Không tìm thấy kết quả'}
            </Typography>
            <Typography variant="body2">
              {currentLanguage === 'en'
                ? 'Try different keywords or check spelling'
                : 'Thử từ khóa khác hoặc kiểm tra chính tả'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer with keyboard shortcuts */}
      <Divider />
      <Box sx={{ p: 2, bgcolor: 'background.neutral' }}>
        <Stack direction="row" spacing={3} justifyContent="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="caption" fontWeight={600}>
                ↑↓
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {currentLanguage === 'en' ? 'Navigate' : 'Di chuyển'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="caption" fontWeight={600}>
                Enter
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {currentLanguage === 'en' ? 'Select' : 'Chọn'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="caption" fontWeight={600}>
                Esc
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {currentLanguage === 'en' ? 'Close' : 'Đóng'}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
}
