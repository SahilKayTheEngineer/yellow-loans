# Yellow Loans Application

A full-stack loan application system built with GraphQL, React, TypeScript, and PostgreSQL, containerized with Docker.

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Apollo Server** (GraphQL)
- **Fastify** (HTTP server)
- **PostgreSQL** with **TypeORM** (ORM)
- **Zod** for validation

### Frontend
- **React** with **TypeScript**
- **Vite** (build tool)
- **Apollo Client** (GraphQL client)
- **React Hook Form** with **Zod** validation
- **Styled Components** (CSS-in-JS styling)

### Infrastructure
- **Docker** & **Docker Compose**

## Features

✅ **Core Requirements**
- Multi-step loan application form
- South African ID number validation with Luhn algorithm
- Age validation (18-65) with automatic extraction from ID number
- Unique ID number enforcement
- Phone selection with dynamic pricing
- Loan calculation (principal, interest, daily/monthly payments)
- Mobile-responsive design

✅ **Extras Implemented**
- Risk scoring based on age groups (3 risk groups)
- Risk-group specific pricing (deposit % and interest rates)
- Affordability check (monthly income > 10x monthly payment)
- Auto-filled birthday from SA ID number
- Real-time loan calculation and preview

## Project Structure

```
yellow-loans/
├── backend/
│   ├── src/
│   │   ├── entities/           # TypeORM entities
│   │   │   ├── Phone.ts
│   │   │   ├── User.ts
│   │   │   ├── UserLoan.ts
│   │   │   └── RiskGroup.ts
│   │   ├── graphql/
│   │   │   ├── resolvers/      # GraphQL resolvers
│   │   │   ├── schema/         # GraphQL schema definitions
│   │   │   └── typeDefs.ts     # Combined schema
│   │   ├── services/           # Business logic
│   │   │   ├── loan-calculation.service.ts
│   │   │   └── validation.service.ts
│   │   ├── utils/              # Utilities
│   │   │   └── sa-id-validator.ts
│   │   ├── data-source.ts      # TypeORM configuration
│   │   ├── startup.ts          # Database seeding
│   │   ├── server.ts           # Apollo Server setup
│   │   └── index.ts            # Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── forms/          # Form components
│   │   │   ├── PhoneCard.tsx
│   │   │   └── LoanSummary.tsx
│   │   ├── pages/              # Page components
│   │   │   └── ApplicationPage.tsx
│   │   ├── graphql/            # GraphQL queries/mutations
│   │   ├── theme.ts            # Styled-components theme
│   │   └── App.tsx
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── QUICK_START.md
```

## Getting Started

### Prerequisites

- **Docker Desktop** installed and running
  - Download from: https://www.docker.com/products/docker-desktop

### Quick Start

1. **Start all services:**
```bash
docker-compose up --build
```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000/graphql

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md).

## Database Schema

### Entities

**User**
- Personal information (name, ID number, birthday)
- Monthly income
- Relationships to RiskGroup, Phone, and UserLoan

**UserLoan**
- Loan details (principal, amount, daily payment)
- Selected phone and risk group
- Checkout step (enum: PENDING, REVIEW, COMPLETED, REJECTED)

**Phone**
- Phone information (name, brand, cash price, image)

**RiskGroup**
- Risk group configuration (deposit %, interest rate)
- Three groups: High Risk (18-30), Medium Risk (31-50), Low Risk (51-65)

## Application Flow

1. **Personal Information**: Enter name and SA ID number (birthday auto-filled)
2. **Income Information**: Enter monthly income
3. **Phone Selection**: Browse and select a phone (filtered by affordability)
4. **Review**: Review all information and loan details before submitting

## South African ID Validation

The system validates SA ID numbers using:
- Format validation (13 digits)
- Date of birth extraction and validation
- Luhn algorithm check digit validation
- Uniqueness check in database
- Automatic birthday field population

## Loan Calculation

- **Deposit**: `cashPrice * depositPercent` (from RiskGroup)
- **Loan Principal**: `cashPrice - depositAmount`
- **Loan Amount**: `loanPrincipal * (1 + interestRate)`
- **Daily Payment**: `loanAmount / 360` (1 year = 360 days)
- **Monthly Payment**: `dailyPayment * 30`

## Risk Groups

- **Group 1** (Age 18-30): 15% deposit, 18% interest
- **Group 2** (Age 31-50): 10% deposit, 15% interest
- **Group 3** (Age 51-65): 5% deposit, 12% interest

## GraphQL API

### Queries

```graphql
# Get all phones (with affordability filtering)
query GetPhones($monthlyIncome: Float, $riskGroupId: ID) {
  phones(monthlyIncome: $monthlyIncome, riskGroupId: $riskGroupId) {
    id
    name
    brand
    cashPrice
    imageUrl
  }
}

# Get phone pricing with risk group
query GetPhonePricing($phoneId: ID!, $riskGroupId: ID!) {
  phonePricing(phoneId: $phoneId, riskGroupId: $riskGroupId) {
    phone { name brand cashPrice }
    riskGroup { name depositPercent interestRate }
    depositAmount
    loanAmount
    dailyPayment
    monthlyPayment
  }
}

# Get user
query GetUser($id: ID!) {
  user(id: $id) {
    id
    firstName
    lastName
    riskGroup { name }
  }
}
```

### Mutations

```graphql
# Create user
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    success
    user {
      id
      riskGroup { id name }
    }
    errors
  }
}

# Create user loan
mutation CreateUserLoan($input: CreateUserLoanInput!) {
  createUserLoan(input: $input) {
    success
    userLoan {
      id
      loanAmount
      dailyPayment
    }
    errors
  }
}
```

## Development

### Backend Commands

```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run typeorm      # TypeORM CLI
npm run migration:generate  # Generate migration
npm run migration:run      # Run migrations
```

### Frontend Commands

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Database Access

See [DATABASE_ACCESS.md](./DATABASE_ACCESS.md) for details on accessing the database.

## Testing the Application

### Sample Data

The seed script creates:
- 3 risk groups (High, Medium, Low risk)
- 5 sample phones with different price points

### Example Application

1. Use a valid 13-digit SA ID number (e.g., `9001015800085`)
   - Birthday will be auto-filled from ID
2. Enter monthly income (e.g., R15,000)
3. Select a phone from the filtered list
4. Review loan details and submit

## Deployment

The application is containerized and ready for deployment to platforms like:
- **Fly.io**
- **Railway**
- **Render**
- **AWS ECS**
- **Google Cloud Run**

### Environment Variables for Production

Update environment variables in `docker-compose.yml` or your deployment platform:
- Use a production PostgreSQL database
- Set `NODE_ENV=production`
- Update `VITE_GRAPHQL_URL` to your production backend URL

## License

This is a take-home project for Yellow.

## Notes

- The SA ID validator uses the Luhn algorithm for check digit validation
- Birthday is automatically extracted from the ID number and cannot be manually edited
- Risk group is automatically determined based on age
- Phones are filtered by affordability (monthly income > 10x monthly payment)
- Database is automatically seeded on first startup
