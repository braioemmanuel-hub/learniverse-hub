import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Video,
  FileText,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson, type Lesson } from "@/hooks/useLessons";

interface LessonManagerProps {
  course: {
    id: string;
    title: string;
  };
  onBack: () => void;
}

const LessonManager = ({ course, onBack }: LessonManagerProps) => {
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [editLessonOpen, setEditLessonOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    content: "",
    video_url: "",
    duration: "",
    is_free: false,
  });

  const { data: lessons, isLoading } = useLessons(course.id);
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();

  const handleAddLesson = async () => {
    if (!newLesson.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    try {
      await createLesson.mutateAsync({
        ...newLesson,
        course_id: course.id,
        order_index: (lessons?.length || 0) + 1,
      });
      setAddLessonOpen(false);
      setNewLesson({
        title: "",
        description: "",
        content: "",
        video_url: "",
        duration: "",
        is_free: false,
      });
      toast.success("Lesson created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create lesson");
    }
  };

  const handleUpdateLesson = async () => {
    if (!selectedLesson) return;

    try {
      await updateLesson.mutateAsync({
        id: selectedLesson.id,
        updates: {
          title: selectedLesson.title,
          description: selectedLesson.description,
          content: selectedLesson.content,
          video_url: selectedLesson.video_url,
          duration: selectedLesson.duration,
          is_free: selectedLesson.is_free,
        },
      });
      setEditLessonOpen(false);
      setSelectedLesson(null);
      toast.success("Lesson updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLesson.mutateAsync({ id: lessonId, courseId: course.id });
      toast.success("Lesson deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete lesson");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Manage Lessons</h2>
          <p className="text-sm text-muted-foreground">{course.title}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {lessons?.length || 0} lesson{lessons?.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={() => setAddLessonOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      {/* Lessons List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border animate-pulse">
              <div className="h-4 bg-secondary rounded w-1/3 mb-2" />
              <div className="h-3 bg-secondary rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : lessons?.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-card border border-border">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No lessons yet</h3>
          <p className="text-muted-foreground mb-4">Add your first lesson to this course</p>
          <Button onClick={() => setAddLessonOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons?.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 text-muted-foreground">
                <GripVertical className="w-4 h-4 cursor-grab" />
                <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground truncate">{lesson.title}</h4>
                  {lesson.is_free && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                      Free Preview
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  {lesson.duration && <span>{lesson.duration}</span>}
                  {lesson.video_url && (
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Video
                    </span>
                  )}
                  {lesson.content && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Content
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedLesson({ ...lesson });
                    setEditLessonOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteLesson(lesson.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Lesson Dialog */}
      <Dialog open={addLessonOpen} onOpenChange={setAddLessonOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
            <DialogDescription>
              Create a new lesson for {course.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Lesson Title *</Label>
              <Input
                id="lesson-title"
                placeholder="Enter lesson title"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-description">Description</Label>
              <Textarea
                id="lesson-description"
                placeholder="Brief description of this lesson"
                value={newLesson.description}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lesson-duration">Duration</Label>
                <Input
                  id="lesson-duration"
                  placeholder="e.g., 15 min"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lesson-video">Video URL</Label>
                <Input
                  id="lesson-video"
                  placeholder="https://..."
                  value={newLesson.video_url}
                  onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-content">Content</Label>
              <Textarea
                id="lesson-content"
                placeholder="Lesson content or notes..."
                rows={5}
                value={newLesson.content}
                onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lesson-free">Free Preview</Label>
                <p className="text-sm text-muted-foreground">Allow non-enrolled users to view</p>
              </div>
              <Switch
                id="lesson-free"
                checked={newLesson.is_free}
                onCheckedChange={(checked) => setNewLesson({ ...newLesson, is_free: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddLessonOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLesson} disabled={createLesson.isPending}>
              {createLesson.isPending ? "Creating..." : "Create Lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={editLessonOpen} onOpenChange={setEditLessonOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
            <DialogDescription>
              Update lesson details
            </DialogDescription>
          </DialogHeader>
          {selectedLesson && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-title">Lesson Title *</Label>
                <Input
                  id="edit-lesson-title"
                  value={selectedLesson.title}
                  onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-description">Description</Label>
                <Textarea
                  id="edit-lesson-description"
                  value={selectedLesson.description || ''}
                  onChange={(e) => setSelectedLesson({ ...selectedLesson, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lesson-duration">Duration</Label>
                  <Input
                    id="edit-lesson-duration"
                    value={selectedLesson.duration || ''}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, duration: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lesson-video">Video URL</Label>
                  <Input
                    id="edit-lesson-video"
                    value={selectedLesson.video_url || ''}
                    onChange={(e) => setSelectedLesson({ ...selectedLesson, video_url: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-content">Content</Label>
                <Textarea
                  id="edit-lesson-content"
                  rows={5}
                  value={selectedLesson.content || ''}
                  onChange={(e) => setSelectedLesson({ ...selectedLesson, content: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="edit-lesson-free">Free Preview</Label>
                  <p className="text-sm text-muted-foreground">Allow non-enrolled users to view</p>
                </div>
                <Switch
                  id="edit-lesson-free"
                  checked={selectedLesson.is_free || false}
                  onCheckedChange={(checked) => setSelectedLesson({ ...selectedLesson, is_free: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLessonOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLesson} disabled={updateLesson.isPending}>
              {updateLesson.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonManager;
