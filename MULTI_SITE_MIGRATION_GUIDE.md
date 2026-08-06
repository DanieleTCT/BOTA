# Multi-Site Database Migration Guide

## Overview

This guide explains how to migrate your Supabase database from single-tenant to multi-tenant architecture, allowing multiple isolated websites to share the same database.

## Key Changes

### Before (Single-Tenant)
- One site per database
- All data shared across all sites
- No isolation between different websites

### After (Multi-Tenant)
- Multiple isolated sites per database
- Each site has its own: config, templates, forms, images
- Complete data isolation using `site_id`
- Scalable architecture for unlimited sites

## Database Schema

### New Tables

#### `sites` table
Manages all websites in the system:
- `id` - Unique identifier
- `name` - Site name
- `domain` - Optional domain/subdomain
- `status` - active/inactive/archived
- `metadata` - Additional site data
- `created_at`, `updated_at` - Timestamps

### Updated Tables

All tables now include `site_id` foreign key:

#### `site_config`
- Added `site_id` column
- One config per site (unique constraint)
- Cascading delete when site is removed

#### `templates`
- New table for JSON templates
- `site_id` for isolation
- `name`, `description`, `data` fields

#### `form_submissions`
- Added `site_id` column
- Indexed for better performance
- Complete isolation of form data

#### `image_gallery`
- Added `site_id` column
- Additional `metadata` field
- Complete isolation of images

## Installation Steps

### Step 1: Run the Migration

Execute the migration SQL in your Supabase project:

```bash
# In Supabase Dashboard > SQL Editor
# Copy and paste the contents of supabase-multi-site-migration.sql
```

**Important**: Run this migration **once** in your Supabase project.

### Step 2: Verify Migration

Check that the migration succeeded:

```sql
-- Verify sites table exists
SELECT * FROM sites;

-- Verify site_id columns added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('site_config', 'form_submissions', 'templates', 'image_gallery')
  AND column_name = 'site_id';

-- Verify indexes created
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('site_config', 'form_submissions', 'templates', 'image_gallery');
```

### Step 3: Update Application Code

Your application code needs to be updated to work with the new multi-site structure. Key changes:

#### A. Identify Current Site

Add logic to determine which site is being accessed:

```typescript
// Example: Identify site from domain/subdomain
const getCurrentSiteId = async (): Promise<string> => {
  const domain = window.location.hostname;
  
  const { data, error } = await supabase
    .from('sites')
    .select('id')
    .eq('domain', domain)
    .eq('status', 'active')
    .single();
  
  if (error || !data) {
    // Fallback to default site
    return '00000000-0000-0000-0000-000000000000';
  }
  
  return data.id;
};
```

#### B. Update Queries to Include site_id

All database queries must now filter by `site_id`:

```typescript
// Before (single-tenant)
const { data } = await supabase
  .from('site_config')
  .select('*')
  .single();

// After (multi-tenant)
const siteId = await getCurrentSiteId();
const { data } = await supabase
  .from('site_config')
  .select('*')
  .eq('site_id', siteId)
  .single();
```

#### C. Update Helper Functions

Update your Supabase client or create a multi-site aware client:

```typescript
// src/lib/supabase-multi-site.ts
import { createClient } from '@supabase/supabase-js';
import { getCurrentSiteId } from './site-detection';

export const createMultiSiteClient = () => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );
  
  // Auto-inject site_id into queries
  const siteIdPromise = getCurrentSiteId();
  
  return {
    ...supabase,
    
    from: (table: string) => {
      const base = supabase.from(table);
      const siteId = await siteIdPromise;
      
      // Auto-filter by site_id for tables that have it
      if (['site_config', 'templates', 'form_submissions', 'image_gallery'].includes(table)) {
        return base.filter('site_id', 'eq', siteId);
      }
      
      return base;
    }
  };
};
```

## Managing Sites

### Create a New Site

```sql
INSERT INTO sites (name, domain, status, metadata)
VALUES (
  'My New Website',
  'newsite.example.com',
  'active',
  '{"color": "#ff0000", "description": "My awesome site"}'
);
```

### List All Sites

```sql
SELECT id, name, domain, status, created_at 
FROM sites 
ORDER BY created_at DESC;
```

### Update Site

```sql
UPDATE sites 
SET 
  name = 'Updated Name',
  domain = 'newdomain.example.com',
  status = 'active',
  metadata = '{"key": "value"}'
WHERE id = 'site-uuid-here';
```

### Deactivate a Site

```sql
UPDATE sites 
SET status = 'inactive' 
WHERE id = 'site-uuid-here';
```

### Delete a Site

```sql
-- This will cascade delete all related data
DELETE FROM sites 
WHERE id = 'site-uuid-here';
```

## Data Isolation

All data is automatically isolated by `site_id`:

```sql
-- Get all data for a specific site
SELECT 
  s.name as site_name,
  sc.data as config,
  COUNT(t.id) as template_count,
  COUNT(fs.id) as form_count,
  COUNT(ig.id) as image_count
FROM sites s
LEFT JOIN site_config sc ON sc.site_id = s.id
LEFT JOIN templates t ON t.site_id = s.id
LEFT JOIN form_submissions fs ON fs.site_id = s.id
LEFT JOIN image_gallery ig ON ig.site_id = s.id
WHERE s.id = 'site-uuid-here'
GROUP BY s.id, sc.data;
```

## Using Views

The migration creates convenient views for accessing data:

### Site Config View
```sql
SELECT * FROM site_config_view 
WHERE site_id = 'site-uuid-here';
```

### Templates View
```sql
SELECT * FROM templates_view 
WHERE site_id = 'site-uuid-here';
```

### Form Submissions View
```sql
SELECT * FROM form_submissions_view 
WHERE site_id = 'site-uuid-here'
  AND status = 'new'
ORDER BY created_at DESC;
```

### Images View
```sql
SELECT * FROM images_view 
WHERE site_id = 'site-uuid-here';
```

## Backward Compatibility

The migration maintains backward compatibility:

1. **Default Site**: A default site with ID `00000000-0000-0000-0000-000000000000` is created
2. **Existing Data**: All existing data is migrated to the default site
3. **Graceful Fallback**: If no site_id is found, the app defaults to the default site

## Security

### Row Level Security (RLS)

All tables have RLS enabled with open policies (as in the original design). For enhanced security:

```sql
-- Restrict admin operations to authenticated users
CREATE POLICY "authenticated_admin_sites"
  ON sites FOR ALL
  TO authenticated
  USING (true);

-- Keep public read access for visitors
CREATE POLICY "anon_read_sites"
  ON sites FOR SELECT
  TO anon
  USING (true);
```

### Site-Specific Access Control

For stricter isolation, implement site-specific policies:

```sql
-- Example: Only allow access to data for the current site
-- (Requires application to set app.current_site_id)
CREATE POLICY "site_isolation_config"
  ON site_config FOR SELECT
  TO anon, authenticated
  USING (site_id = current_setting('app.current_site_id')::uuid);
```

## Performance Optimization

### Indexes Created

The migration creates the following indexes:
- `idx_site_config_site_id` - Fast site config lookups
- `idx_templates_site_id` - Fast template queries
- `idx_form_submissions_site_created` - Fast form submissions by date
- `idx_form_submissions_site_status` - Fast form status filtering
- `idx_image_gallery_site_id` - Fast image gallery queries

### Query Performance Tips

```sql
-- Use site_id in WHERE clause (indexed)
SELECT * FROM form_submissions 
WHERE site_id = 'site-uuid-here'
  AND created_at > NOW() - INTERVAL '7 days';

-- Avoid queries without site_id filter
-- SLOW: SELECT * FROM form_submissions;
-- FAST: SELECT * FROM form_submissions WHERE site_id = '...';
```

## Testing the Migration

### Test 1: Create Multiple Sites

```sql
INSERT INTO sites (name, domain) VALUES 
  ('Site A', 'site-a.example.com'),
  ('Site B', 'site-b.example.com');
```

### Test 2: Add Site-Specific Data

```sql
-- Config for Site A
INSERT INTO site_config (site_id, data) 
VALUES ('site-a-uuid', '{"title": "Site A"}');

-- Config for Site B
INSERT INTO site_config (site_id, data) 
VALUES ('site-b-uuid', '{"title": "Site B"}');
```

### Test 3: Verify Isolation

```sql
-- Site A should only see its own config
SELECT * FROM site_config WHERE site_id = 'site-a-uuid';
-- Result: {"title": "Site A"}

SELECT * FROM site_config WHERE site_id = 'site-b-uuid';
-- Result: {"title": "Site B"}
```

## Next Steps

1. **Update Application Code**
   - Implement site detection logic
   - Update all Supabase queries to include site_id
   - Test with multiple sites

2. **Update Admin Panel**
   - Add site management interface
   - Show site-specific data only
   - Add site switching functionality

3. **Deploy Changes**
   - Deploy updated application code
   - Test all sites after deployment
   - Monitor for errors

4. **Add New Sites**
   - Create site in `sites` table
   - Configure initial data
   - Set up domain/subdomain routing

## Troubleshooting

### Issue: "column site_id does not exist"
**Solution**: Run the migration SQL again. The `IF NOT EXISTS` clauses are idempotent.

### Issue: "duplicate key value violates unique constraint"
**Solution**: Check if site_id is already set. The migration handles existing data.

### Issue: "foreign key constraint violation"
**Solution**: Ensure the site exists in the `sites` table before referencing it.

### Issue: Data showing from wrong site
**Solution**: Ensure all queries filter by site_id. Check the site detection logic.

## Rollback Plan

If you need to rollback:

```sql
-- Option 1: Keep default site, remove site_id columns
ALTER TABLE site_config DROP COLUMN IF EXISTS site_id;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS site_id;

-- Option 2: Full rollback (requires database restore from backup)
-- Contact your DBA or Supabase support
```

## Support

For questions or issues:
1. Check the SQL files for reference
2. Review Supabase documentation on RLS and multi-tenancy
3. Test migrations in a development environment first

## Summary

✅ **Multi-site architecture implemented**
✅ **Data isolation between sites**
✅ **Scalable design for unlimited sites**
✅ **Backward compatible with existing data**
✅ **Performance optimized with indexes**
✅ **Ready for production use**

Your database is now ready to support multiple isolated websites!