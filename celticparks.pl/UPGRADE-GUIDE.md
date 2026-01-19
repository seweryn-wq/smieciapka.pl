# Celtic Park - Storage System Upgrade Guide

## 🎯 What's New in v2.1

### Enhanced Storage System
- ✅ **IndexedDB** as primary storage (50MB+ capacity)
- ✅ **Auto-backup** every 10 minutes (toggleable)
- ✅ **Manual backup/restore** with single-click
- ✅ **Automatic migration** from localStorage
- ✅ **localStorage fallback** for compatibility
- ✅ **Timestamped backups** preventing overwrites

---

## 📦 Backup File Format

```json
{
  "version": "2.0",
  "timestamp": "2024-12-21T14:30:22.000Z",
  "appVersion": "MVP 2.0 - Enhanced Storage",
  "databases": {
    "spots": { ... },
    "vendors": [ ... ],
    "prices": [ ... ]
  },
  "metadata": {
    "totalSpots": 764,
    "mappedSpots": 3,
    "assignedSpots": 1,
    "totalVendors": 5,
    "totalPrices": 3
  }
}
```

**Filename Format:** `celtic-park-backup-YYYY-MM-DD-HHMMSS.json`

**Example:** `celtic-park-backup-2024-12-21-143022.json`

---

## 🚀 Migration Process

### Automatic Migration (Recommended)

1. **Open the new version** in your browser
2. **Migration happens automatically** on first load
3. **All data from localStorage** → moved to IndexedDB
4. **Original localStorage data** → kept as backup
5. **Success message** appears confirming migration

### What Gets Migrated

- ✅ All parking spots (positioned and unpositioned)
- ✅ All vendors with colors
- ✅ All prices
- ✅ All vendor-spot assignments
- ✅ All price-spot assignments

### Manual Verification

After migration, verify in browser DevTools:

```
F12 → Application → IndexedDB → CelticParkDB
  ├── spots (object store)
  ├── vendors (object store)
  ├── prices (object store)
  └── metadata (object store)
```

---

## 💾 Backup System

### Auto-Backup

**Default:** ON (every 10 minutes)

**How it works:**
1. Monitors changes to data
2. Every 10 minutes, checks if changes occurred
3. If yes → downloads backup automatically
4. Resets change counter

**Toggle auto-backup:**
- Click the "Auto-backup: ON/OFF" indicator in header
- Green pulsing dot = enabled
- Gray dot = disabled
- Preference saved in localStorage

### Manual Backup

**Button:** 💾 Pobierz Backup

**Action:** 
- Creates complete backup of all data
- Downloads immediately as JSON file
- Filename: `celtic-park-backup-YYYY-MM-DD-HHMMSS.json`

**When to use:**
- Before major changes
- Before vendor/price deletions
- End of work session
- Before app updates

---

## 📤 Restore System

### Restore from Backup

**Button:** 📤 Przywróć z Backupu

**⚠️ WARNING:** This will **WIPE ALL CURRENT DATA** and replace with backup!

**Process:**
1. Click "Przywróć z Backupu"
2. Select backup JSON file
3. Confirm warning dialog
4. All data is cleared
5. Backup data is restored
6. Page auto-refreshes

**Safety:**
- Always shows confirmation dialog
- Cannot be undone
- Creates complete replacement
- Previous data is lost

**Best Practice:**
1. Download current backup first (safety!)
2. Then restore from old backup
3. Verify data after restore

---

## 🔄 Backward Compatibility

### Old localStorage Data

- ✅ Automatically migrated on first load
- ✅ Kept as fallback/backup
- ✅ Not deleted (safe migration)

### Fallback Behavior

If IndexedDB fails:
1. App falls back to localStorage
2. Error message shown
3. All features still work
4. Capacity limited to 5-10MB

---

## 📊 Storage Comparison

| Feature | Old (localStorage) | New (IndexedDB) |
|---------|-------------------|-----------------|
| **Capacity** | 5-10 MB | 50+ MB |
| **Performance** | Good | Excellent |
| **Backup** | Manual export | Auto + manual |
| **Restore** | Manual import | One-click |
| **Versioning** | None | Timestamped |
| **Data safety** | Manual | Automated |
| **Multi-table** | 3 JSON strings | 4 object stores |

---

## 🧪 Testing Checklist

### Initial Setup
- [ ] Open app - auto-migration should occur
- [ ] Check console for "✅ IndexedDB initialized"
- [ ] Check console for "✅ Migration completed"
- [ ] Verify all previous data is visible

### Backup System
- [ ] Click "💾 Pobierz Backup" → file downloads
- [ ] Check filename format is correct
- [ ] Open JSON file → verify structure
- [ ] Verify metadata shows correct counts

### Auto-Backup
- [ ] Check indicator shows "Auto-backup: ON"
- [ ] Green dot is pulsing
- [ ] Make changes to data
- [ ] Wait 10+ minutes
- [ ] Auto-backup file should download

### Restore System
- [ ] Create manual backup (safety!)
- [ ] Click "📤 Przywróć z Backupu"
- [ ] Select backup file
- [ ] Confirm warning dialog
- [ ] Verify data restored correctly
- [ ] Check all vendors, prices, spots

### Fallback Testing
- [ ] Open DevTools → Application → IndexedDB
- [ ] Delete CelticParkDB database
- [ ] Refresh page
- [ ] Should see fallback message
- [ ] App still works with localStorage

---

## 🛠️ Troubleshooting

### Problem: Migration didn't work

**Solution:**
1. Open DevTools Console
2. Look for error messages
3. Check if localStorage has data: `localStorage.getItem('parkingSpots')`
4. Manually trigger: `await app.storage.migrateFromLocalStorage()`

### Problem: Auto-backup not working

**Solution:**
1. Check indicator status
2. Make some changes
3. Check console for errors
4. Verify: `app.storage.autoBackupEnabled`
5. Restart: `app.storage.toggleAutoBackup()` (twice)

### Problem: Backup file won't restore

**Solution:**
1. Validate JSON format
2. Check required fields exist
3. Check console for specific error
4. Try different backup file

### Problem: Data missing after refresh

**Solution:**
1. Check IndexedDB in DevTools
2. Check localStorage as fallback
3. Restore from last backup
4. Check browser storage quotas

---

## 📝 Important Notes

### File Management

**Old backups:** Previous JSON exports (from old system) are still compatible with manual restore, but won't have the new metadata structure.

**Multiple backups:** Each backup has a timestamp, so no files are overwritten. You can accumulate backups.

**Cleanup:** Periodically delete old backup files to save disk space.

### Browser Compatibility

- ✅ Chrome/Edge (excellent support)
- ✅ Firefox (excellent support)
- ✅ Safari (good support)
- ❌ IE11 (not supported - IndexedDB required)

### Storage Limits

**IndexedDB:**
- Minimum: 50 MB per origin
- Usually: 100+ MB available
- Can request more if needed

**localStorage (fallback):**
- 5-10 MB limit
- Synchronous (slower)
- String-only storage

---

## 🎓 Best Practices

### Daily Workflow
1. Start work → check auto-backup is ON
2. Make changes → auto-backup handles it
3. Before deletions → manual backup
4. End of day → manual backup

### Data Safety
1. Keep multiple backup files
2. Don't rely only on auto-backup
3. Test restore occasionally
4. Archive old backups offline

### Performance
1. IndexedDB is async → better performance
2. Don't disable auto-backup
3. Manual backups are instant
4. Restore requires page refresh

---

## 🆘 Emergency Recovery

If everything goes wrong:

1. **Check localStorage:**
   ```javascript
   // In console:
   localStorage.getItem('parkingSpots')
   localStorage.getItem('parkingVendors')
   localStorage.getItem('parkingPrices')
   ```

2. **Manual export:**
   ```javascript
   // In console:
   const backup = {
     spots: JSON.parse(localStorage.getItem('parkingSpots') || '{}'),
     vendors: JSON.parse(localStorage.getItem('parkingVendors') || '[]'),
     prices: JSON.parse(localStorage.getItem('parkingPrices') || '[]')
   };
   console.log(JSON.stringify(backup));
   // Copy and save to .json file
   ```

3. **Delete and restore:**
   - Delete IndexedDB: DevTools → Application → IndexedDB → Delete
   - Refresh page
   - Use restore from backup

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify DevTools → Application → IndexedDB
3. Test with backup file
4. Review this guide

---

**Version:** 2.1  
**Last Updated:** December 21, 2024  
**Compatibility:** Backward compatible with v2.0
