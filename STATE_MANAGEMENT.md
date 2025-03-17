# BizLevel State Management

## Context Providers

### AuthContext

- Purpose: Manage user authentication state
- State:
  - user: Current user information
  - isLoading: Authentication loading state
  - isAuthenticated: Boolean indicating authentication status
- Methods:
  - login(email, password)
  - logout()
  - register(email, password, name)

### ProgressContext

- Purpose: Track user progress through levels
- State:
  - currentLevel: Current level user is working on
  - completedLevels: Array of completed level IDs
  - unlockedLevels: Array of unlocked level IDs
- Methods:
  - completeLevel(levelId)
  - unlockLevel(levelId)
  - getProgress()

...
