
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, Tag, Settings, Plus, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const folderColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

export const AppSidebar = ({
  folders,
  selectedFolder,
  onFolderSelect,
  allTags,
  selectedTags,
  onTagsChange,
  onSettingsClick,
  onAddFolder,
  onDeleteFolder,
}) => {
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("bg-blue-500");

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName("");
      setNewFolderColor("bg-blue-500");
      setShowAddFolder(false);
    }
  };

  const handleDeleteFolder = (folderId, e) => {
    e.stopPropagation();
    onDeleteFolder(folderId);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-r border-white/20 w-64 h-screen flex flex-col fixed left-0 top-0 z-10">
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex-shrink-0">
        <h2 className="font-semibold text-slate-800">Navigation</h2>
      </div>
      
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Folders Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span className="text-sm font-medium">Folders</span>
            </div>
            <Dialog open={showAddFolder} onOpenChange={setShowAddFolder}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle>Add New Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Folder Name</label>
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex gap-2 mt-2">
                      {folderColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewFolderColor(color)}
                          className={`w-6 h-6 rounded ${color} ${
                            newFolderColor === color ? "ring-2 ring-slate-400" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowAddFolder(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFolder}>
                      Add Folder
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-1">
            <button
              onClick={() => onFolderSelect("all")}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedFolder === "all"
                  ? "bg-emerald-100 text-emerald-800"
                  : "hover:bg-slate-100"
              }`}
            >
              All Notes
            </button>
            {folders.map((folder) => (
              <div key={folder.id} className="group relative">
                <button
                  onClick={() => onFolderSelect(folder.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                    selectedFolder === folder.id
                      ? "bg-emerald-100 text-emerald-800"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-3 h-3 rounded ${folder.color} mr-2`} />
                  {folder.name}
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteFolder(folder.id, e)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4" />
            <span className="text-sm font-medium">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer text-xs transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "hover:bg-slate-200"
                }`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Badge>
            ))}
            {allTags.length === 0 && (
              <p className="text-sm text-slate-500">No tags yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Settings Button */}
      <div className="p-4 border-t border-white/20 flex-shrink-0">
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-100 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </div>
  );
};
