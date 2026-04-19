# Safe Database Practices - Job Hub

## **Before Making Changes**

### 1. **Always Backup First**
```bash
# Create backup
node scripts/automated-backup.cjs

# Or manual backup
node scripts/backup-jobs.cjs
```

### 2. **Use Test Environment**
```bash
# Test on local development first
npm run dev

# Test on Vercel preview
git push origin feature-branch
```

### 3. **Check Current Status**
```bash
# Check current jobs
node scripts/check-current-jobs.cjs
```

## **During Development**

### 1. **Use Database Branching**
- Create Neon branch for testing
- Test migrations on branch first
- Merge only after verification

### 2. **Incremental Changes**
- Make small, reversible changes
- Test each change individually
- Keep rollback plan ready

### 3. **Monitor Progress**
```bash
# Check database status
node scripts/check-current-jobs.cjs

# Verify API responses
curl https://rwandajobhub.vercel.app/api/jobs
```

## **After Changes**

### 1. **Verify Everything**
```bash
# Check final state
node scripts/check-current-jobs.cjs

# Test website functionality
# Visit https://rwandajobhub.vercel.app
```

### 2. **Create New Backup**
```bash
# Backup after successful changes
node scripts/automated-backup.cjs
```

### 3. **Commit Changes**
```bash
git add .
git commit -m "Safe database changes with backup"
git push origin main
```

## **Emergency Recovery**

### If Jobs Are Lost:
```bash
# 1. Check current state
node scripts/check-current-jobs.cjs

# 2. Restore from latest backup
node scripts/restore-jobs.cjs backups/latest-backup.json

# 3. Verify restoration
node scripts/check-current-jobs.cjs
```

### If Backup Fails:
```bash
# 1. Check Neon console for point-in-time recovery
# 2. Contact Neon support for database restoration
# 3. Use old database if still accessible
```

## **Automation Setup**

### Daily Backup (Optional):
```bash
# Add to package.json scripts
"scripts": {
  "backup": "node scripts/automated-backup.cjs",
  "restore": "node scripts/restore-jobs.cjs",
  "check": "node scripts/check-current-jobs.cjs"
}

# Run daily backup
npm run backup
```

### GitHub Actions (Advanced):
```yaml
# .github/workflows/backup.yml
name: Daily Database Backup
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Run backup
        run: npm run backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## **Contact Information**

### Neon Support:
- Dashboard: https://console.neon.tech
- Documentation: https://neon.tech/docs
- Support: support@neon.tech

### Emergency Contacts:
- Database Administrator: [Your contact]
- Vercel Support: https://vercel.com/support

## **Quick Reference**

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run backup` | Create backup | Before any changes |
| `npm run check` | Check status | To verify data |
| `npm run restore <file>` | Restore data | When data is lost |
| `git status` | Check git state | Before committing |
| `vercel logs` | Check deployment | When issues occur |

## **Best Practices**

1. **Never make changes without backup**
2. **Always test on development first**
3. **Keep multiple backup versions**
4. **Document all changes**
5. **Monitor database performance**
6. **Use environment variables for sensitive data**
7. **Implement proper error handling**
8. **Regular security audits**

---

**Remember**: It's better to spend 5 minutes backing up than 5 hours restoring!
