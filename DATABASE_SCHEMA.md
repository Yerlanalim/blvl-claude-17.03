# BizLevel Database Schema

## Tables Structure

### Users Table

- id: UUID (primary key)
- email: String (unique)
- full_name: String
- avatar_url: String
- created_at: Timestamp
- last_login: Timestamp
- business_type: String
- business_size: String

### Levels Table

- id: UUID (primary key)
- order_number: Integer
- title: String
- description: Text
- thumbnail_url: String
- is_active: Boolean

### Videos Table

- id: UUID (primary key)
- level_id: UUID (foreign key)
- order_number: Integer
- title: String
- url: String
- duration: Integer
- thumbnail_url: String

...

## Relationships

- User -> UserProgress: One-to-Many
- Level -> Videos: One-to-Many
- Level -> Artifacts: One-to-Many
  ...

## RLS Policies

For Users table:
