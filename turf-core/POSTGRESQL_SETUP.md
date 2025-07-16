# PostgreSQL Database Setup Guide

## Prerequisites

1. **PostgreSQL installed** on your system
2. **Java 17+** and **Maven** installed
3. **Spring Boot application** ready to run

## Step 1: Install PostgreSQL (if not already installed)

### Windows:
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for the `postgres` user

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 2: Create Database

1. **Connect to PostgreSQL** as superuser:
```bash
sudo -u postgres psql
```

2. **Create the database**:
```sql
CREATE DATABASE turf_booking_db;
```

3. **Create a user** (optional, if you want to use a different user):
```sql
CREATE USER turf_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE turf_booking_db TO turf_user;
```

4. **Exit PostgreSQL**:
```sql
\q
```

## Step 3: Run Database Setup Script

1. **Connect to the new database**:
```bash
psql -U postgres -d turf_booking_db
```

2. **Run the setup script**:
```bash
\i database-setup.sql
```

Or copy and paste the contents of `database-setup.sql` directly into the psql terminal.

## Step 4: Verify Configuration

The application is now configured to use PostgreSQL with:
- **Database URL**: `jdbc:postgresql://localhost:5432/turf_booking_db`
- **Username**: `postgres`
- **Password**: `Printf`
- **DDL Mode**: `update` (tables will be created/updated automatically)

## Step 5: Start the Application

1. **Build the project**:
```bash
mvn clean install
```

2. **Run the application**:
```bash
mvn spring-boot:run
```

## Step 6: Test the Connection

1. **Create a category** using Postman:
   - **POST** `http://localhost:8080/api/categories`
   - **Headers**: `Authorization: Bearer <admin_jwt>`
   - **Body**:
   ```json
   {
     "name": "Football",
     "description": "Football ground"
   }
   ```

2. **Check the database**:
```bash
psql -U postgres -d turf_booking_db
```
```sql
SELECT * FROM categories;
```

## Troubleshooting

### Connection Issues:
1. **Check if PostgreSQL is running**:
   ```bash
   sudo systemctl status postgresql
   ```

2. **Check if the database exists**:
   ```bash
   psql -U postgres -l
   ```

3. **Verify credentials**:
   ```bash
   psql -U postgres -d turf_booking_db
   ```

### Port Issues:
- Default PostgreSQL port is `5432`
- If using a different port, update `application.properties`:
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:YOUR_PORT/turf_booking_db
  ```

### Permission Issues:
- Make sure the `postgres` user has proper permissions
- Check PostgreSQL logs: `/var/log/postgresql/postgresql-*.log`

## Database Management

### Access Database:
```bash
psql -U postgres -d turf_booking_db
```

### Common Commands:
```sql
-- List all tables
\dt

-- Describe a table
\d table_name

-- List all databases
\l

-- Switch database
\c database_name

-- Exit
\q
```

### Backup Database:
```bash
pg_dump -U postgres turf_booking_db > backup.sql
```

### Restore Database:
```bash
psql -U postgres turf_booking_db < backup.sql
```

## Benefits of PostgreSQL over H2:

1. **Persistent Data**: Data survives application restarts
2. **Production Ready**: Scalable and robust
3. **Advanced Features**: JSON support, full-text search, etc.
4. **Better Performance**: Optimized for production workloads
5. **Backup & Recovery**: Professional database management tools 