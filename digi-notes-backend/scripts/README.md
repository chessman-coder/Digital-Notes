# Fake Data Generator

This script generates fake data for the Digi Notes application to help with development and testing.

## What it creates

- **1 Test User** with login credentials
- **8 Folders** with different colors and categories
- **15 Tags** for organizing notes
- **100 Notes** with realistic content, distributed across folders and tags

## Usage

### Generate fake data
```bash
npm run generate-data
```
or
```bash
node scripts/generate-fake-data.js
```

### Clear existing data and generate new data
```bash
npm run generate-data:clear
```
or
```bash
node scripts/generate-fake-data.js --clear
```

## Test User Credentials

After running the script, you can login with:
- **Email**: `test@example.com`
- **Password**: `password123`

## Generated Data Details

### Folders (8 total)
- Work (blue)
- Personal (green)
- Projects (purple)
- Ideas (red)
- Learning (yellow)
- Health (indigo)
- Travel (pink)
- Recipes (teal)

### Tags (15 total)
- important, urgent, work, personal, ideas
- todo, completed, in-progress, review, meeting
- project, learning, health, finance, travel

### Notes (100 total)
- Realistic titles and content
- Random distribution across folders (70% have folders)
- Random tags (0-4 tags per note)
- Random pin status (10% pinned)
- Random archive status (5% archived)
- Creation dates spread from January 2024 to present

## Features

- **Database Initialization**: Automatically creates tables if they don't exist
- **Data Clearing**: Option to clear existing data before generating new data
- **Progress Tracking**: Shows progress while creating notes
- **Statistics**: Displays summary of generated data
- **Realistic Content**: Uses varied, realistic note titles and content
- **Random Distribution**: Notes are randomly distributed across folders and tags

## Script Structure

The script includes several utility functions:
- `clearExistingData()` - Removes all existing data
- `createTestUser()` - Creates the test user account
- `createFolders()` - Creates folder categories
- `createTags()` - Creates tag labels
- `createNotes()` - Generates 100 notes with random properties
- `generateStatistics()` - Shows summary of created data

## Database Tables

The script works with these database tables:
- `users` - User accounts
- `folders` - Note organization folders
- `tags` - Note tags/labels
- `notes` - The actual notes
- `note_tags` - Many-to-many relationship between notes and tags

## Error Handling

The script includes comprehensive error handling and will:
- Initialize database tables if they don't exist
- Show clear error messages if something goes wrong
- Clean up database connections properly
- Exit gracefully on errors