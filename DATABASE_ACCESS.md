# Database Access Guide

## TablePlus Connection

**Connection Details:**
- **Type**: PostgreSQL
- **Host**: `localhost`
- **Port**: `5433` (external port)
- **User**: `yellow_user`
- **Password**: `yellow_password`
- **Database**: `yellow_loans`

### Quick Steps:
1. Open TablePlus
2. Click "Create a new connection" or "+"
3. Select **PostgreSQL**
4. Fill in the details above
5. Click "Test" then "Connect"

## Direct psql Access

Connect via command line:

```bash
docker-compose exec postgres psql -U yellow_user -d yellow_loans
```

## Database Schema

### Tables:

**users**
- id (UUID, Primary Key)
- firstName
- lastName
- idNumber (unique, indexed)
- birthday
- monthlyIncome (nullable)
- riskGroupId (FK to risk_groups)
- selectedPhoneId (FK to phones)
- loanId (FK to user_loans)
- createdAt
- updatedAt

**user_loans**
- id (UUID, Primary Key)
- userId (FK to users)
- phoneId (FK to phones)
- riskGroupId (FK to risk_groups)
- deposit
- loanPrincipal
- loanAmount
- dailyPayment
- checkoutStep (enum: PENDING, REVIEW, COMPLETED, REJECTED)
- createdAt
- updatedAt

**phones**
- id (UUID, Primary Key)
- name
- brand
- cashPrice
- imageUrl (nullable)
- createdAt
- updatedAt

**risk_groups**
- id (UUID, Primary Key)
- groupNumber (1, 2, or 3)
- name
- depositPercent
- interestRate
- createdAt
- updatedAt

## Useful Queries

### View all phones:
```sql
SELECT * FROM phones ORDER BY cashPrice;
```

### View all users:
```sql
SELECT * FROM users ORDER BY createdAt DESC;
```

### View all loans:
```sql
SELECT * FROM user_loans ORDER BY createdAt DESC;
```

### View loans with user and phone details:
```sql
SELECT 
  ul.*,
  u."firstName" || ' ' || u."lastName" as user_name,
  p.name as phone_name,
  p.brand as phone_brand,
  rg.name as risk_group
FROM user_loans ul
JOIN users u ON ul."userId" = u.id
JOIN phones p ON ul."phoneId" = p.id
JOIN risk_groups rg ON ul."riskGroupId" = rg.id
ORDER BY ul."createdAt" DESC;
```

### Count loans by checkout step:
```sql
SELECT "checkoutStep", COUNT(*) as count
FROM user_loans
GROUP BY "checkoutStep";
```

### View users with their risk groups:
```sql
SELECT 
  u.*,
  rg.name as risk_group_name,
  rg."depositPercent",
  rg."interestRate"
FROM users u
LEFT JOIN risk_groups rg ON u."riskGroupId" = rg.id
ORDER BY u."createdAt" DESC;
```

### Find users by ID number:
```sql
SELECT * FROM users WHERE "idNumber" = '9001015800085';
```

## Notes

- The database persists data in a Docker volume (`postgres_data`)
- Data survives container restarts
- To reset database: `docker-compose down -v` (⚠️ deletes all data)
- Internal port is 5432, external port is 5433
- Database is automatically seeded with risk groups and phones on first startup
