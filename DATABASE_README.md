# Cybersecurity Assessment Platform Database Schema

This document explains the database schema for the Cybersecurity Assessment Platform MVP.

## Overview

The database is designed to support the following core functionalities:

1. User management with role-based access control
2. Storage of evaluation results from the cybersecurity assessments
3. Different access levels for initial vs. advanced evaluations

## Schema Structure

### User Management

- **Profile**: Stores user information linked to external authentication (Supabase)
  - Supports different user roles (FREE, PREMIUM, SUPERADMIN)
  - FREE users can access initial evaluations
  - PREMIUM users can access advanced evaluations and the dashboard
  - SUPERADMIN users have full administrative access
  - Tracks basic user information and activity status
  - Stores email and company information

### Evaluation Storage

- **Evaluation**: Stores the results of cybersecurity assessments
  - Supports two types of evaluations: INITIAL and ADVANCED
  - Stores all answers as a JSON object
  - Linked to a user profile
  - Calculates and stores an overall security score

## User Flow and Access Control

### Initial Evaluations
- Available to all registered users (FREE and PREMIUM)
- Results are stored in the database and linked to the user's profile
- FREE users can only access initial evaluations

### Advanced Evaluations
- Require a PREMIUM user role
- Will be part of a paid tier
- Results are accessible via the dashboard
- Only PREMIUM users can access advanced evaluations

### Dashboard Access
- Only PREMIUM users can access the dashboard
- Users can view their evaluation history
- Both initial and advanced evaluations are visible in the dashboard

## Key Relationships

1. A Profile can have multiple Evaluations (both initial and advanced)
2. All Evaluations must be linked to a Profile
3. Access to different evaluation types is controlled by the user's role

## Implementation Notes

1. The schema uses PostgreSQL via Supabase
2. All IDs use CUID for security and uniqueness
3. Appropriate indexes are defined for query performance
4. JSON storage is used for flexibility in storing evaluation answers
5. Questions and options are defined in the application code, not in the database
6. User roles control access to different features

## JSON Structure for Answers

The `answers` field in the Evaluation model stores a JSON object with the following structure:

```json
{
  "questionId1": 3,  // Value of the selected option
  "questionId2": 1,
  "questionId3": 2,
  // ... more question responses
}
```

This approach provides several benefits:
- Flexibility to change questions without database schema changes
- Simplified querying for evaluation results
- Reduced database complexity

## Role-Based Access Control

The system implements role-based access control through the UserRole enum:

1. **FREE**: Basic users who can only take initial evaluations
   - Can register and create a profile
   - Can complete initial evaluations
   - Cannot access the dashboard or advanced evaluations

2. **PREMIUM**: Paid users with full access
   - Can take both initial and advanced evaluations
   - Can access the dashboard to view their evaluation history
   - Will have access to additional features in the future

3. **SUPERADMIN**: Administrative users
   - Full access to all features
   - Can manage users and content
   - Access to administrative functions

## Future Considerations

If the application grows in complexity, the schema can be expanded to include:

1. Storing questions and options in the database
2. Adding recommendation generation
3. Implementing expert referral system
4. Adding benchmarking capabilities
5. Subscription management for paid tiers

## Database Diagram

For a visual representation of the schema, refer to the `database_schema.dbml` file, which can be visualized using tools like [dbdiagram.io](https://dbdiagram.io). 