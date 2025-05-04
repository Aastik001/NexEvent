import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventActionsProps {
  eventId: string;
  isCreator: boolean;
  onDelete: () => void;
  isLoading?: boolean;
}

const EventActions = ({ eventId, isCreator, onDelete, isLoading }: EventActionsProps) => {
  const navigate = useNavigate();

  if (!isCreator) return null;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/event/${eventId}/edit`)}
        disabled={isLoading}
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <Trash2 className="h-4 w-4 mr-2" />
        )}
        Delete
      </Button>
    </div>
  );
};

export default EventActions;