require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { initializeTables } = require('../models/initTables');

// Sample data arrays for generating realistic content
const noteTitles = [
  'Meeting Notes - Project Alpha',
  'Shopping List',
  'Book Recommendations',
  'Travel Plans for Summer',
  'Recipe: Chocolate Chip Cookies',
  'Daily Journal Entry',
  'Work Tasks for This Week',
  'Ideas for Blog Posts',
  'Workout Routine',
  'Budget Planning',
  'Learning Goals 2024',
  'Movie Watchlist',
  'Gift Ideas for Family',
  'Home Improvement Projects',
  'Coding Interview Prep',
  'Grocery List',
  'Weekend Plans',
  'Research Notes',
  'Personal Reflections',
  'Project Brainstorming',
  'Health and Wellness Tips',
  'Technology Trends',
  'Career Development',
  'Creative Writing Ideas',
  'Photography Inspiration',
  'Music Playlist Ideas',
  'Cooking Experiments',
  'Gardening Notes',
  'Financial Planning',
  'Language Learning Progress',
  'Meditation Thoughts',
  'Book Club Discussion',
  'Event Planning',
  'DIY Project Ideas',
  'Vacation Memories',
  'Goal Setting Session',
  'Problem Solving Strategies',
  'Daily Gratitude',
  'Skill Development',
  'Networking Contacts'
];

const noteContents = [
  'This is a detailed note about the meeting we had today. We discussed various aspects of the project and came up with actionable items.',
  'Need to buy: milk, bread, eggs, cheese, apples, bananas, chicken, rice, pasta, tomatoes.',
  'Here are some great books I want to read: The Great Gatsby, To Kill a Mockingbird, 1984, Pride and Prejudice.',
  'Planning a trip to Europe this summer. Need to book flights, hotels, and create an itinerary for Paris, Rome, and Barcelona.',
  'Ingredients: 2 cups flour, 1 cup sugar, 1/2 cup butter, 2 eggs, 1 tsp vanilla, 1 cup chocolate chips. Bake at 350°F for 12 minutes.',
  'Today was a productive day. I accomplished most of my goals and feel satisfied with the progress I made.',
  'Tasks for this week: Complete project proposal, attend team meeting, review code, update documentation, prepare presentation.',
  'Blog post ideas: How to improve productivity, Best practices for remote work, Technology trends in 2024, Personal development tips.',
  'Monday: Cardio 30 min, Tuesday: Strength training, Wednesday: Yoga, Thursday: Running, Friday: Rest day, Weekend: Hiking.',
  'Monthly budget breakdown: Rent $1200, Groceries $400, Utilities $150, Transportation $200, Entertainment $100, Savings $500.',
  'Goals for this year: Learn a new programming language, read 24 books, exercise regularly, improve cooking skills, travel to 3 new places.',
  'Movies to watch: Inception, The Shawshank Redemption, Pulp Fiction, The Dark Knight, Forrest Gump, The Matrix.',
  'Gift ideas: Mom - jewelry, Dad - books, Sister - art supplies, Brother - gaming accessories, Best friend - concert tickets.',
  'Home projects: Paint the living room, fix the leaky faucet, organize the garage, plant a garden, update kitchen lighting.',
  'Interview preparation: Review data structures, practice algorithms, prepare behavioral questions, research the company, mock interviews.',
  'Weekly groceries: Fresh vegetables, fruits, protein sources, whole grains, dairy products, healthy snacks, beverages.',
  'Weekend activities: Visit the museum, try a new restaurant, go for a hike, catch up with friends, work on hobby project.',
  'Research findings on renewable energy sources and their impact on the environment. Solar and wind power show promising results.',
  'Reflecting on personal growth and the lessons learned this month. Grateful for the opportunities and challenges that helped me develop.',
  'Brainstorming session for the new product launch. Key features to include: user-friendly interface, mobile compatibility, security features.',
  'Health tips: Drink more water, get adequate sleep, exercise regularly, eat balanced meals, manage stress, take breaks from screens.',
  'Emerging technologies: AI and machine learning, blockchain, IoT, quantum computing, augmented reality, 5G networks.',
  'Career development plan: Acquire new skills, build professional network, seek mentorship, take on challenging projects, pursue certifications.',
  'Creative writing prompts: A mysterious letter arrives, time travel adventure, life in a different era, magical realism story.',
  'Photography ideas: Golden hour portraits, urban architecture, nature landscapes, street photography, macro shots, black and white series.',
  'Playlist themes: Workout motivation, relaxing evening, road trip songs, focus music, nostalgic hits, discover new artists.',
  'Cooking experiments: Fusion cuisine, plant-based recipes, fermentation projects, baking challenges, international dishes.',
  'Garden planning: Choose suitable plants for the climate, prepare soil, create watering schedule, pest control strategies, seasonal maintenance.',
  'Financial goals: Build emergency fund, invest in retirement, pay off debt, create multiple income streams, track expenses.',
  'Language learning progress: Completed beginner level, practicing conversation, expanding vocabulary, understanding grammar rules.',
  'Meditation insights: Finding inner peace, managing emotions, staying present, developing mindfulness, creating daily practice.',
  'Book discussion points: Character development, plot analysis, themes and symbolism, author\'s writing style, personal connections.',
  'Event planning checklist: Venue booking, catering arrangements, guest list, decorations, entertainment, photography, timeline.',
  'DIY project inspiration: Upcycling furniture, creating wall art, building storage solutions, crafting decorations, home organization.',
  'Vacation memories: Beautiful sunsets, delicious local food, friendly people, exciting adventures, cultural experiences, relaxation.',
  'Goal setting framework: Define specific objectives, create action plans, set deadlines, track progress, celebrate achievements.',
  'Problem-solving approach: Identify the issue, gather information, brainstorm solutions, evaluate options, implement and monitor.',
  'Daily gratitude practice: Appreciating family and friends, good health, opportunities for growth, beautiful moments, simple pleasures.',
  'Skill development roadmap: Identify areas for improvement, find learning resources, practice regularly, seek feedback, apply knowledge.',
  'Professional contacts: Industry experts, potential mentors, collaboration partners, career advisors, networking connections.'
];

const folderNames = [
  'Work',
  'Personal',
  'Projects',
  'Ideas',
  'Learning',
  'Health',
  'Travel',
  'Recipes',
  'Books',
  'Goals'
];

const folderColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-gray-500'
];

const tagNames = [
  'important',
  'urgent',
  'work',
  'personal',
  'ideas',
  'todo',
  'completed',
  'in-progress',
  'review',
  'meeting',
  'project',
  'learning',
  'health',
  'finance',
  'travel',
  'recipe',
  'book',
  'movie',
  'music',
  'creative'
];

// Utility functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Main generator functions
async function clearExistingData() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🧹 Clearing existing data...');
    
    // Delete in reverse order of dependencies
    await connection.execute('DELETE FROM note_tags');
    await connection.execute('DELETE FROM notes');
    await connection.execute('DELETE FROM tags');
    await connection.execute('DELETE FROM folders');
    await connection.execute('DELETE FROM users');
    
    // Reset auto-increment counters
    await connection.execute('ALTER TABLE note_tags AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE notes AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE tags AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE folders AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    
    console.log('✅ Existing data cleared successfully');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function createTestUser() {
  const connection = await pool.getConnection();
  
  try {
    console.log('👤 Creating test user...');
    
    const username = 'testuser';
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [username, email, hashedPassword]
    );
    
    const userId = result.insertId;
    console.log(`✅ Test user created with ID: ${userId}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    return userId;
    
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function createFolders(userId) {
  const connection = await pool.getConnection();
  
  try {
    console.log('📁 Creating folders...');
    
    const folders = [];
    const numFolders = Math.min(folderNames.length, 8); // Create 8 folders
    
    for (let i = 0; i < numFolders; i++) {
      const name = folderNames[i];
      const color = folderColors[i];
      
      const [result] = await connection.execute(
        'INSERT INTO folders (name, color, userId, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
        [name, color, userId]
      );
      
      folders.push({
        id: result.insertId,
        name,
        color
      });
    }
    
    console.log(`✅ Created ${folders.length} folders`);
    return folders;
    
  } catch (error) {
    console.error('❌ Error creating folders:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function createTags(userId) {
  const connection = await pool.getConnection();
  
  try {
    console.log('🏷️  Creating tags...');
    
    const tags = [];
    const numTags = Math.min(tagNames.length, 15); // Create 15 tags
    
    for (let i = 0; i < numTags; i++) {
      const name = tagNames[i];
      
      const [result] = await connection.execute(
        'INSERT INTO tags (name, userId, createdAt) VALUES (?, ?, NOW())',
        [name, userId]
      );
      
      tags.push({
        id: result.insertId,
        name
      });
    }
    
    console.log(`✅ Created ${tags.length} tags`);
    return tags;
    
  } catch (error) {
    console.error('❌ Error creating tags:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function createNotes(userId, folders, tags) {
  const connection = await pool.getConnection();
  
  try {
    console.log('📝 Creating 100 notes...');
    
    const notes = [];
    const startDate = new Date(2024, 0, 1); // January 1, 2024
    const endDate = new Date(); // Current date
    
    for (let i = 0; i < 100; i++) {
      // Get random title and content
      const title = getRandomElement(noteTitles) + (i > noteTitles.length ? ` ${i}` : '');
      const content = getRandomElement(noteContents);
      
      // Randomly assign folder (70% chance of having a folder)
      const folderId = Math.random() < 0.7 ? getRandomElement(folders).id : null;
      
      // Random pin and archive status (10% pinned, 5% archived)
      const isPinned = Math.random() < 0.1;
      const isArchived = Math.random() < 0.05;
      
      // Random creation date
      const createdAt = getRandomDate(startDate, endDate);
      const updatedAt = new Date(createdAt.getTime() + Math.random() * (endDate.getTime() - createdAt.getTime()));
      
      // Create the note
      const [result] = await connection.execute(
        'INSERT INTO notes (title, content, userId, folderId, isPinned, isArchived, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, content, userId, folderId, isPinned, isArchived, createdAt, updatedAt]
      );
      
      const noteId = result.insertId;
      
      // Randomly assign tags (0-4 tags per note)
      const numTags = Math.floor(Math.random() * 5);
      if (numTags > 0) {
        const selectedTags = getRandomElements(tags, numTags);
        
        for (const tag of selectedTags) {
          await connection.execute(
            'INSERT INTO note_tags (noteId, tagId) VALUES (?, ?)',
            [noteId, tag.id]
          );
        }
      }
      
      notes.push({
        id: noteId,
        title,
        content: content.substring(0, 50) + '...',
        folderId,
        isPinned,
        isArchived,
        tagCount: numTags
      });
      
      // Progress indicator
      if ((i + 1) % 20 === 0) {
        console.log(`📝 Created ${i + 1}/100 notes...`);
      }
    }
    
    console.log(`✅ Created ${notes.length} notes successfully`);
    return notes;
    
  } catch (error) {
    console.error('❌ Error creating notes:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function generateStatistics(userId) {
  const connection = await pool.getConnection();
  
  try {
    console.log('📊 Generating statistics...');
    
    // Get counts
    const [noteCount] = await connection.execute('SELECT COUNT(*) as count FROM notes WHERE userId = ?', [userId]);
    const [folderCount] = await connection.execute('SELECT COUNT(*) as count FROM folders WHERE userId = ?', [userId]);
    const [tagCount] = await connection.execute('SELECT COUNT(*) as count FROM tags WHERE userId = ?', [userId]);
    const [pinnedCount] = await connection.execute('SELECT COUNT(*) as count FROM notes WHERE userId = ? AND isPinned = 1', [userId]);
    const [archivedCount] = await connection.execute('SELECT COUNT(*) as count FROM notes WHERE userId = ? AND isArchived = 1', [userId]);
    
    // Get folder distribution
    const [folderStats] = await connection.execute(`
      SELECT f.name, COUNT(n.id) as note_count 
      FROM folders f 
      LEFT JOIN notes n ON f.id = n.folderId 
      WHERE f.userId = ? 
      GROUP BY f.id, f.name 
      ORDER BY note_count DESC
    `, [userId]);
    
    // Get tag usage
    const [tagStats] = await connection.execute(`
      SELECT t.name, COUNT(nt.noteId) as usage_count 
      FROM tags t 
      LEFT JOIN note_tags nt ON t.id = nt.tagId 
      WHERE t.userId = ? 
      GROUP BY t.id, t.name 
      ORDER BY usage_count DESC 
      LIMIT 10
    `, [userId]);
    
    console.log('\n📊 DATA GENERATION SUMMARY');
    console.log('=' .repeat(50));
    console.log(`👤 User ID: ${userId}`);
    console.log(`📝 Total Notes: ${noteCount[0].count}`);
    console.log(`📁 Total Folders: ${folderCount[0].count}`);
    console.log(`🏷️  Total Tags: ${tagCount[0].count}`);
    console.log(`📌 Pinned Notes: ${pinnedCount[0].count}`);
    console.log(`📦 Archived Notes: ${archivedCount[0].count}`);
    
    console.log('\n📁 FOLDER DISTRIBUTION:');
    folderStats.forEach(folder => {
      console.log(`  ${folder.name}: ${folder.note_count} notes`);
    });
    
    console.log('\n🏷️  TOP TAGS:');
    tagStats.forEach(tag => {
      console.log(`  ${tag.name}: ${tag.usage_count} uses`);
    });
    
    console.log('\n🎉 Fake data generation completed successfully!');
    console.log('You can now use the following credentials to login:');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: password123');
    
  } catch (error) {
    console.error('❌ Error generating statistics:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function generateFakeData() {
  try {
    console.log('🚀 Starting fake data generation...\n');
    
    // Initialize database tables first
    await initializeTables();
    
    // Check if --clear flag is provided
    const shouldClear = process.argv.includes('--clear');
    
    if (shouldClear) {
      await clearExistingData();
    }
    
    // Create test user
    const userId = await createTestUser();
    
    // Create folders
    const folders = await createFolders(userId);
    
    // Create tags
    const tags = await createTags(userId);
    
    // Create 100 notes
    await createNotes(userId, folders, tags);
    
    // Generate statistics
    await generateStatistics(userId);
    
  } catch (error) {
    console.error('❌ Fake data generation failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the generator
if (require.main === module) {
  generateFakeData();
}

module.exports = {
  generateFakeData,
  clearExistingData
};