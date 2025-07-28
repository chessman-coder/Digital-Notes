
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const NotesGrid = ({
  notes,
  selectedNote,
  onNoteSelect,
  onNoteDelete,
  folders,
}) => {
  const getFolderColor = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || "bg-gray-500";
  };

  const getFolderName = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.name || "Unknown";
  };

  return (
    <div className="p-6 space-y-4">
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No notes found</p>
          <p className="text-sm text-slate-400 mt-1">Create your first note to get started</p>
        </div>
      ) : (
        notes.map((note) => (
          <Card
            key={note.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md bg-white/60 border-white/40 group ${
              selectedNote?.id === note.id ? "ring-2 ring-emerald-500 bg-white/80" : ""
            }`}
            onClick={() => onNoteSelect(note)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-slate-800 line-clamp-1">
                  {note.title}
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNoteDelete(note.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onNoteDelete(note.id);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="py-2">
              <p className="text-sm text-slate-600 line-clamp-3">
                {note.content || "No content"}
              </p>
            </CardContent>
            
            <CardFooter className="pt-2 pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded ${getFolderColor(note.folderId)}`} />
                  <span className="text-xs text-slate-500">{getFolderName(note.folderId)}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                </span>
              </div>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};
