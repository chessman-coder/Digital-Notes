
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit3, Save, X, Tag, Folder, ArrowLeft } from "lucide-react";

export const NoteEditor = ({
  note,
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onClose,
  folders,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedFolder(note.folderId);
      setTags(note.tags || []);
    } else {
      setTitle("");
      setContent("");
      setSelectedFolder(folders[0]?.id || "");
      setTags([]);
    }
  }, [note, folders]);

  const handleSave = () => {
    const updatedNote = {
      ...note,
      title: title.trim() || "Untitled",
      content,
      folderId: selectedFolder,
      tags,
    };
    
    console.log("Saving note:", updatedNote);
    onSave(updatedNote);
  };

  const handleCancel = () => {
    console.log("Canceling note edit");
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const getFolderName = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.name || "Unknown";
  };

  const getFolderColor = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || "bg-gray-500";
  };

  if (!note && !isEditing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center">
          <Edit3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No note selected</h3>
          <p className="text-slate-500">Select a note to view or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-emerald-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-white/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {note && !isEditing && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${getFolderColor(selectedFolder)}`} />
                <span className="text-sm text-slate-600">{getFolderName(selectedFolder)}</span>
              </div>
            </div>
            
            {note && !isEditing ? (
              <Button onClick={onEdit} className="bg-emerald-600 hover:bg-emerald-700">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {isEditing ? (
              // Edit Mode
              <>
                <div className="space-y-4">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title..."
                    className="text-2xl font-bold border-none bg-transparent px-0 focus-visible:ring-0"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        <Folder className="h-4 w-4 inline mr-1" />
                        Folder
                      </label>
                      <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                        <SelectTrigger className="bg-white/70">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded ${folder.color}`} />
                                {folder.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        <Tag className="h-4 w-4 inline mr-1" />
                        Tags
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add a tag..."
                          className="bg-white/70"
                        />
                        <Button onClick={addTag} variant="outline" size="sm">
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your note..."
                  className="min-h-[400px] bg-white/70 border-white/40 text-base leading-relaxed"
                />
              </>
            ) : (
              // View Mode
              <>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-4">{note.title}</h1>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Card className="bg-white/60 border-white/40">
                  <CardContent className="p-6">
                    <div className="prose prose-slate max-w-none">
                      {note.content ? (
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                          {note.content}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">This note is empty</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
