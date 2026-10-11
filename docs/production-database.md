# Production database operating standard

EduExpress currently uses Prisma with SQLite on the VPS. The database is stored at `/app/prisma/data/prod.db`, backed by the host-mounted `./prisma/data` directory in `docker-compose.yml`. It therefore survives application container replacement.

## Launch requirements

1. Run only one application writer instance while SQLite is the production database.
2. Run `npm run db:check` inside the production container before accepting traffic.
3. Keep the automatic timestamped backup created by `docker-entrypoint.sh` before schema synchronization.
4. Copy database backups to a separate machine or object-storage account every day.
5. Test a restore into a temporary environment every quarter.
6. Never deploy a schema command with `--accept-data-loss`.

## Scale gate

Move to a managed multi-user database before adding multiple application replicas, high-volume concurrent editing or a separate CRM writer. That migration requires a tested data map, record counts before and after, a rollback copy, and a scheduled maintenance window; it must not be performed automatically during deployment.
