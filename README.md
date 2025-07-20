# Break It Yourself: The Anatomy of an Integration Bug

This repository demonstrates "side-channel" integration bugs in microservices - the kind of hidden dependencies that break when AI assistants refactor code without full system context.

> **Important**: This is a monorepo for demo convenience, but it simulates **cross-repository changes** where an AI assistant only sees one service at a time. In reality, these would be separate repositories owned by different teams, making the hidden dependencies even more dangerous.

## The Architecture

This project contains three microservices that demonstrate common integration failure patterns:

- **Rider-Fares-Service** (Node.js): Calculates and stores ride costs, publishes trip events
- **Analytics-Service** (Python): Reads directly from the Fares database replica for ETL jobs  
- **Payouts-Service** (Node.js): Consumes trip events to calculate driver payouts

## Prerequisites

You only need **Docker and Docker Compose** installed. No Node.js, Python, or other dependencies required locally.

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nimbuscloud-ai/anatomy-of-an-integration-bug.git
   cd anatomy-of-an-integration-bug
   ```

2. **Run tests to verify everything works:**
   ```bash
   ./scripts/test.sh
   ```
   All tests should pass on the `main` branch.

3. **Try the interactive demo:**
   ```bash
   ./scripts/demo.sh
   ```
   This starts all three services and shows their logs in real-time.

## Experiment 1: The Database Type Change Bug

This experiment demonstrates how changing a database column type can break downstream services that read from database replicas.

**The AI Refactor:** An AI assistant working only on the Rider-Fares-Service repository was asked to "improve data precision by changing the fare_amount column from a float to a decimal." The AI had no visibility into the Analytics service or its database replica dependency.

### Experience the Breakage:

1. **Switch to the problematic branch:**
   ```bash
   git checkout feature/ai-db-refactor
   ```

2. **Run the tests:**
   ```bash
   ./scripts/test.sh
   ```
   Note: This should pass.

3. **Run the demo:**
   ```bash
   ./scripts/demo.sh
   ```

**What breaks:** During the demo, the `analytics.service.test.js` will fail because:
- The AI correctly changed `fare_amount` from `FLOAT` to `DECIMAL(10, 2)`
- In PostgreSQL/MySQL, Sequelize returns decimal values as strings (e.g., `"10.50"`) to preserve precision
- The Analytics service tries to add these strings: `"10.50" + "20.25"` = `"10.5020.25"`
- The test expects `30.75` but gets string concatenation instead

> **Database Note:** SQLite doesn't exhibit the same DECIMAL-to-string behavior as PostgreSQL/MySQL. For this demo, we simulate the real-world PostgreSQL behavior where DECIMAL fields return as strings to preserve precision.

**Why it's dangerous:** This is a silent failure that would corrupt data in production. The AI, working only within the Rider-Fares-Service repository, had no way to discover the Analytics service reading from the database replica in a completely separate codebase.

## Experiment 2: The Removed Event Field Bug

This experiment shows how removing an "unused" event field can silently break downstream consumers.

**The AI Refactor:** An AI assistant working only on the Rider-Fares-Service repository was asked to "clean up the TripCompleted event by removing unused fields." From the AI's limited view of a single repository, the `driverTier` field appeared completely unused.

### Experience the Breakage:

1. **Switch to the problematic branch:**
   ```bash
   git checkout feature/ai-event-refactor
   ```

2. **Run the tests:**
   ```bash
   ./scripts/test.sh
   ```
   Note: This should pass.

3. **Run the demo:**
   ```bash
   ./scripts/demo.sh
   ```

**What breaks:** During the demo, the `payouts.service.test.js` will fail because:
- The AI removed the `driverTier` field from the TripCompleted event
- The field wasn't used by the Fares service itself, so it seemed "unused" within that single repository
- The Payouts service (in a separate repository) relies on this field to calculate driver bonuses
- Without it, payouts are calculated incorrectly

**Why it's dangerous:** This demonstrates the "tolerant reader" pattern backfiring. The consuming service silently handles missing fields, masking the integration bug until it's discovered in production.

## The Pattern

Both failures follow the same pattern:
1. An AI makes a perfectly reasonable change when viewing only a single repository
2. Local tests within that repository pass completely  
3. A hidden dependency breaks in a different service/repository
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

**Demo Architecture Note**: In reality, these would be three separate Git repositories, possibly owned by different teams (Fares, Analytics, and Payments teams). The shared database and event infrastructure would be managed separately. This monorepo structure is purely for demo convenience - it allows you to easily reproduce the cross-repository integration failures that would occur when an AI assistant works on isolated codebases.

The project uses Docker, SQLite and file-based event queues to run without external dependencies, making it easy to reproduce these integration bugs locally.

---

*This demo accompanies the blog post: ["The Anatomy of an Integration Bug: It's Not Just Your APIs"*](https://nimbusai.dev/blog/the-anatomy-of-an-integration-bug-its-not-just-your-apis)