# Break It Yourself: The Anatomy of an Integration Bug

This repository demonstrates "side-channel" integration bugs in microservices - the kind of hidden dependencies that break when AI assistants refactor code without full system context.

## The Architecture

This project contains three microservices that demonstrate common integration failure patterns:

- **Rider-Fares-Service**: Calculates and stores ride costs, publishes trip events
- **Analytics-Service**: Reads directly from the Fares database replica for ETL jobs  
- **Payouts-Service**: Consumes trip events to calculate driver payouts

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize the database:**
   ```bash
   npm run setup
   ```

3. **Run tests to verify everything works:**
   ```bash
   npm test
   ```
   All tests should pass on the `main` branch.

4. **Try the interactive demo:**
   ```bash
   npm run demo
   ```
   This shows the services working together correctly.

## Experiment 1: The Database Type Change Bug

This experiment demonstrates how changing a database column type can break downstream services that read from database replicas.

**The AI Refactor:** An AI assistant was asked to "improve data precision by changing the fare_amount column from a float to a decimal."

### Experience the Breakage:

1. **Switch to the problematic branch:**
   ```bash
   git checkout feature/ai-db-refactor
   ```

2. **Apply the new database migration:**
   ```bash
   npm run setup
   ```

3. **Run the tests:**
   ```bash
   npm test
   ```

**What breaks:** The `analytics.service.test.js` will fail because:
- The AI correctly changed `fare_amount` from `FLOAT` to `DECIMAL(10, 2)`
- Sequelize now returns decimal values as strings (e.g., `"10.50"`)
- The Analytics service tries to add these strings: `"10.50" + "20.25"` = `"10.5020.25"`
- The test expects `30.75` but gets string concatenation instead

**Why it's dangerous:** This is a silent failure that would corrupt data in production. The AI had no visibility into the Analytics service reading from the database replica.

## Experiment 2: The Removed Event Field Bug

This experiment shows how removing an "unused" event field can silently break downstream consumers.

**The AI Refactor:** An AI assistant was asked to "clean up the TripCompleted event by removing unused fields."

### Experience the Breakage:

1. **Switch to the problematic branch:**
   ```bash
   git checkout feature/ai-event-refactor
   ```

2. **Ensure clean database state:**
   ```bash
   npm run setup
   ```

3. **Run the tests:**
   ```bash
   npm test
   ```

**What breaks:** The `payouts.service.test.js` will fail because:
- The AI removed the `driverTier` field from the TripCompleted event
- The field wasn't used by the Fares service itself, so it seemed "unused"
- The Payouts service relies on this field to calculate driver bonuses
- Without it, payouts are calculated incorrectly

**Why it's dangerous:** This demonstrates the "tolerant reader" pattern backfiring. The consuming service silently handles missing fields, masking the integration bug until it's discovered in production.

## The Pattern

Both failures follow the same pattern:
1. An AI makes a perfectly reasonable change in isolation
2. Local tests pass completely  
3. A hidden dependency breaks in a different service
4. The breakage is often silent and hard to detect

## Key Takeaways

- **Side-channel dependencies** (database replicas, event schemas) are invisible to traditional static analysis
- **AI coding assistants** amplify this risk by refactoring quickly without architectural context
- **Local testing** is insufficient for catching integration bugs
- **Silent failures** are often more dangerous than loud crashes

## Architecture Files

```
/
├── services/
│   ├── rider-fares-service/     # Creates fares, publishes events
│   ├── analytics-service/       # Reads from DB replica  
│   ├── payouts-service/         # Consumes events
│   └── shared/
│       ├── db.js               # Sequelize models
│       └── event-queue.js      # File-based event simulator
├── migrations/                 # Database schema
└── db/                        # SQLite database file
```

The project uses SQLite and file-based event queues to run without external dependencies, making it easy to reproduce these integration bugs locally.

---

*This demo accompanies the blog post: "The Anatomy of an Integration Bug: It's Not Just Your APIs"*