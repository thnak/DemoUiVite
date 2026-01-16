# Language Resource Planning

This document outlines the plan for managing and updating language resources in the application.

## Current State

The application currently supports the following languages:
- **English (en)** - Default language
- **Vietnamese (vi)** - Secondary language

Language configuration is centralized in:
- `src/locales/i18n.ts` - Main i18n configuration with `allLangs` array
- `src/locales/langs/en.json` - English translations
- `src/locales/langs/vi.json` - Vietnamese translations

## Translation Management

### Adding New Languages

To add a new language to the application:

1. **Create Translation File**
   - Add a new JSON file in `src/locales/langs/` (e.g., `zh.json` for Chinese)
   - Copy the structure from `en.json` as a template
   - Translate all keys to the new language

2. **Update i18n Configuration**
   ```typescript
   // In src/locales/i18n.ts
   
   import zh from './langs/zh.json'; // Import new translation
   
   export const allLangs = [
     {
       value: 'en',
       label: 'English',
       icon: '/assets/icons/flags/ic-flag-en.svg',
     },
     {
       value: 'vi',
       label: 'Tiếng Việt',
       icon: '/assets/icons/flags/ic-flag-vi.svg',
     },
     {
       value: 'zh', // Add new language
       label: '中文',
       icon: '/assets/icons/flags/ic-flag-zh.svg',
     },
   ];
   
   i18n.init({
     resources: {
       en: { translation: en },
       vi: { translation: vi },
       zh: { translation: zh }, // Register new translation
     },
     // ... rest of config
   });
   ```

3. **Add Flag Icon**
   - Place the flag SVG icon in `/public/assets/icons/flags/`
   - Follow naming convention: `ic-flag-{code}.svg`
   - Recommended size: 26x20px

### Translation Components

The application uses the `TranslationSection` component for entity translations:

```typescript
<TranslationSection
  translations={formData.translations}
  onTranslationsChange={handleTranslationsChange}
  disabled={isPending}
/>
```

This component:
- Displays a dropdown of available languages from `allLangs`
- Filters out languages that have already been added
- Shows language flags and labels for better UX
- Provides add/remove functionality for translations

### Where Translation Sections Are Used

Translation sections are currently implemented in:
- Area create/edit views
- Product create/edit views
- Product Category create/edit views
- Machine create/edit views
- Machine Type create/edit views
- Calendar create/edit views
- Stop Machine Reason create/edit views
- Stop Machine Reason Group create/edit views
- Defect Reason create/edit views
- Defect Reason Group create/edit views

## Future Improvements

### Planned Enhancements

1. **Translation Coverage Tracking**
   - Add tools to track which entities have translations
   - Generate reports on translation completeness
   - Identify missing translations across languages

2. **Translation Import/Export**
   - Implement CSV/Excel import functionality
   - Allow bulk translation updates
   - Support exporting translations for external translation services

3. **Translation Fallback Improvements**
   - Enhance fallback to default language when translation missing
   - Show visual indicators for missing translations
   - Allow inline translation editing for admins

4. **Language Detection**
   - Improve automatic language detection
   - Remember user's language preference
   - Support browser language detection

5. **RTL Language Support**
   - Add support for right-to-left languages (Arabic, Hebrew)
   - Implement RTL-aware layouts and components
   - Test and optimize RTL user experience

### Priority List

**High Priority:**
- [ ] Translation coverage tracking tool
- [ ] Missing translation indicators
- [ ] CSV import/export for bulk updates

**Medium Priority:**
- [ ] Admin translation management interface
- [ ] Translation version history
- [ ] Multi-language search support

**Low Priority:**
- [ ] Machine translation suggestions
- [ ] Translation quality scoring
- [ ] Community translation contributions

## Best Practices

### For Developers

1. **Always use translation keys** instead of hardcoded strings
2. **Use descriptive translation keys** (e.g., `dashboard.title` not `dt`)
3. **Group related translations** by module or feature
4. **Provide context** in translation files with comments when needed
5. **Test all languages** before deploying changes

### For Content Editors

1. **Keep translations concise** - UI space is limited
2. **Maintain consistent terminology** across translations
3. **Consider cultural differences** when translating
4. **Test translations in context** - preview before publishing
5. **Update all languages** when adding new features

## Translation Keys Structure

The translation files follow a hierarchical structure:

```json
{
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome back"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "entities": {
    "area": "Area",
    "product": "Product",
    "machine": "Machine"
  }
}
```

## Contact and Support

For questions about translations or language support:
- Technical issues: Open an issue on GitHub
- Translation requests: Contact the development team
- Translation contributions: Submit a pull request

## Changelog

### 2026-01-16
- Updated `TranslationSection` component to use language dropdown
- Centralized language configuration in `allLangs`
- Replaced manual translation inputs in Stop Machine Reason views
- Updated `LanguagePopover` to use centralized language list
- Created this planning document

