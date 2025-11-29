# Migration Files

## ترتيب الملفات حسب الاعتماديات:

1. **20240101000001-create-projects.js** - الأساسي (لا يعتمد على شيء)
2. **20240101000002-create-users.js** - يعتمد على `projects`
3. **20240101000003-create-groups.js** - يعتمد على `projects`
4. **20240101000004-create-friendships.js** - يعتمد على `users`
5. **20240101000005-create-group-members.js** - يعتمد على `groups` و `users`
6. **20240101000006-create-messages.js** - يعتمد على `projects`, `users`, `groups`

## الأوامر:

### إنشاء Migration جديد:
```bash
npx sequelize-cli migration:generate --name migration-name
```

### تشغيل جميع الـ Migrations:
```bash
npm run migrate
# أو
npx sequelize-cli db:migrate
```

### التراجع عن آخر Migration:
```bash
npm run migrate:undo
# أو
npx sequelize-cli db:migrate:undo
```

### التراجع عن جميع الـ Migrations:
```bash
npm run migrate:undo:all
# أو
npx sequelize-cli db:migrate:undo:all
```

### التراجع عن migration محدد:
```bash
npx sequelize-cli db:migrate:undo --to 20240101000005-create-group-members.js
```

### عرض حالة الـ Migrations:
```bash
npx sequelize-cli db:migrate:status
```

## ملاحظات:

- جميع الـ Enums تم تحويلها إلى `STRING` بدلاً من `ENUM`
- تم إضافة Foreign Keys مع `CASCADE` للـ update و delete
- تم إضافة Indexes على جميع Foreign Keys
- تم إضافة Unique Index على `friendships(userId1, userId2)`

