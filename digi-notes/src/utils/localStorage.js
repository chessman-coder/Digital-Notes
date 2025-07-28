
const STORAGE_PREFIX = 'digital_journal_';

export const saveUserData = (userEmail, data) => {
  try {
    const key = `${STORAGE_PREFIX}${userEmail}`;
    localStorage.setItem(key, JSON.stringify(data));
    console.log('User data saved for:', userEmail);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const loadUserData = (userEmail) => {
  try {
    const key = `${STORAGE_PREFIX}${userEmail}`;
    const data = localStorage.getItem(key);
    if (data) {
      console.log('User data loaded for:', userEmail);
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  return null;
};

export const getDefaultData = () => ({
  notes: [
    {
      id: "1",
      title: "Welcome to Your Digital Journal",
      content: "Start writing your thoughts, ideas, and memories here. Use tags to organize and find your notes easily.",
      tags: ["welcome", "getting-started"],
      folder: "personal",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Ideas for the Weekend",
      content: "- Visit the local farmers market\n- Try that new hiking trail\n- Organize the home office\n- Call mom and dad",
      tags: ["weekend", "personal", "family"],
      folder: "personal",
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
  ],
  folders: [
    { id: "personal", name: "Personal", color: "bg-green-500" },
    { id: "work", name: "Work", color: "bg-blue-500" },
    { id: "ideas", name: "Ideas", color: "bg-purple-500" },
  ],
});
