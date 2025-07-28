import { useState, useEffect } from "react";
import { Search, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotesGrid } from "@/components/NotesGrid";
import { NoteEditor } from "@/components/NoteEditor";
import { Settings as SettingsComponent } from "@/components/Settings";
import { AuthScreen } from "@/components/AuthScreen";
import { useIsMobile } from "@/hooks/use-mobile";
import apiClient from "@/utils/api";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = apiClient.getToken();
    const savedUser = localStorage.getItem('currentUser');
    
    if (token && savedUser) {
      // Check if token is still valid
      if (apiClient.checkTokenValidity()) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
          loadUserData();
        } catch (error) {
          console.error('Error parsing saved user:', error);
          apiClient.clearAuth();
        }
      } else {
        // Token expired, clear auth
        apiClient.clearAuth();
        setError('Your session has expired. Please log in again.');
      }
    }
  }, []);

  // Set up periodic token validation
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        if (!apiClient.checkTokenValidity()) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setError('Your session has expired. Please log in again.');
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Load user data from API
  const loadUserData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [notesData, foldersData] = await Promise.all([
        apiClient.getNotes(),
        apiClient.getFolders()
      ]);
      
      setNotes(notesData || []);
      setFolders(foldersData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === "all" || note.folderId === selectedFolder;
    const matchesTags = selectedTags.length === 0 ||
                       selectedTags.some(tag => note.tags && note.tags.includes(tag));
    
    return matchesSearch && matchesFolder && matchesTags;
  });

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    loadUserData();
    console.log("User authenticated:", user);
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedNote(null);
    setIsEditing(false);
    setNotes([]);
    setFolders([]);
    console.log("User logged out");
  };

  const createNewNote = async () => {
    if (!folders.length) {
      setError("Please create a folder first");
      return;
    }

    const defaultFolderId = selectedFolder === "all" ? folders[0]?.id : selectedFolder;
    
    try {
      const newNote = await apiClient.createNote({
        title: "Untitled Note",
        content: "",
        tags: [],
        folderId: defaultFolderId,
      });
      
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note. Please try again.');
    }
  };

  const handleSaveNote = async (updatedNote) => {
    console.log("Handling save note:", updatedNote);
    setLoading(true);
    
    try {
      const savedNote = await apiClient.updateNote(updatedNote.id, {
        title: updatedNote.title,
        content: updatedNote.content,
        folderId: updatedNote.folderId,
        tags: updatedNote.tags
      });
      
      setNotes(notes.map(note =>
        note.id === savedNote.id ? savedNote : note
      ));
      setSelectedNote(savedNote);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = async () => {
    console.log("Handling cancel edit");
    setIsEditing(false);
    
    // If it's a new note that was never saved (no content and default title), delete it
    if (selectedNote && selectedNote.title === "Untitled Note" && !selectedNote.content) {
      try {
        await apiClient.deleteNote(selectedNote.id);
        setNotes(notes.filter(note => note.id !== selectedNote.id));
        setSelectedNote(null);
      } catch (error) {
        console.error('Error deleting empty note:', error);
      }
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await apiClient.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note. Please try again.');
    }
  };

  const addFolder = async (name, color) => {
    try {
      const newFolder = await apiClient.createFolder({ name, color });
      setFolders([...folders, newFolder]);
    } catch (error) {
      console.error('Error creating folder:', error);
      setError('Failed to create folder. Please try again.');
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      await apiClient.deleteFolder(folderId);
      
      // Remove the folder from state
      setFolders(folders.filter(folder => folder.id !== folderId));
      
      // Reset selected folder if it's the one being deleted
      if (selectedFolder === folderId) {
        setSelectedFolder("all");
      }
      
      // Reload notes to reflect folder changes
      await loadUserData();
    } catch (error) {
      console.error('Error deleting folder:', error);
      setError('Failed to delete folder. Please try again.');
    }
  };

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Show main journal interface after authentication
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <AppSidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          allTags={allTags}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          onSettingsClick={() => setShowSettings(true)}
          onAddFolder={addFolder}
          onDeleteFolder={deleteFolder}
        />
        
        <div className="ml-64 flex flex-col min-h-screen">
          {/* Header */}
          <div className="p-4 border-b border-white/20 bg-white/40 flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Digital Notes
            </h1>
          </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <div className="flex items-center justify-between">
                  <p className="text-red-600 text-sm">{error}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError("")}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}
  
            {/* Loading State */}
            {loading && (
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <p className="text-blue-600 text-sm">Loading...</p>
              </div>
            )}
  
            <div className="flex flex-col md:flex-row flex-1 h-full">
              {/* Notes List */}
              <div className={`${selectedNote && !isMobile ? 'w-1/3' : 'flex-1'} bg-white/60 backdrop-blur-sm border-r border-white/20 flex flex-col h-full ${
                selectedNote && isMobile ? 'hidden' : ''
              }`}>
                {/* Current Folder Display */}
                {selectedFolder !== "all" && (
                  <div className="p-4 border-b border-white/20 bg-white/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${folders.find(f => f.id === selectedFolder)?.color || 'bg-gray-500'}`} />
                      <h2 className="text-lg font-semibold text-slate-800">
                        {folders.find(f => f.id === selectedFolder)?.name || 'Unknown Folder'}
                      </h2>
                    </div>
                  </div>
                )}
                
                {/* Header */}
                <div className="p-6 border-b border-white/20 bg-white/40">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      onClick={createNewNote}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={folders.length === 0}
                      title={folders.length === 0 ? "Please create a folder first" : "Create a new note"}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New Note
                    </Button>
                  </div>
                  
                  {folders.length === 0 && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-sm text-amber-700">
                        Please create a folder first before adding notes.
                      </p>
                    </div>
                  )}
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/80 border-white/40 focus:border-emerald-300"
                    />
                  </div>
                </div>
  
                {/* Notes Grid */}
                <div className="flex-1 overflow-y-auto">
                  <NotesGrid
                    notes={filteredNotes}
                    selectedNote={selectedNote}
                    onNoteSelect={setSelectedNote}
                    onNoteDelete={deleteNote}
                    folders={folders}
                  />
                </div>
              </div>
  
              {/* Note Editor */}
              {selectedNote && (
                <div className={`${isMobile ? 'flex-1' : 'flex-1'} bg-white/40 backdrop-blur-sm`}>
                  <NoteEditor
                    note={selectedNote}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSaveNote}
                    onCancel={handleCancelEdit}
                    onClose={() => {
                      setSelectedNote(null);
                      setIsEditing(false);
                    }}
                    allTags={allTags}
                    folders={folders}
                  />
                </div>
              )}
  
              {/* Empty State */}
              {!selectedNote && !isMobile && (
                <div className="flex-1 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-slate-600">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-semibold mb-2">No note selected</h3>
                    <p className="text-slate-500">Choose a note from the sidebar or create a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Settings Modal - Moved outside SidebarProvider for proper z-index */}
      {showSettings && (
        <SettingsComponent
          onClose={() => setShowSettings(false)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Index;
