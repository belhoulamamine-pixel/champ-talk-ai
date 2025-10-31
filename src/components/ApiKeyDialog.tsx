import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyDialog = ({ open, onOpenChange }: ApiKeyDialogProps) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Key Loaded</DialogTitle>
          <DialogDescription>
            Using your server-provided OpenRouter API key securely from environment variables.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm text-muted-foreground">
          Your API key is automatically configured and never shown on screen.
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleClose}>OK</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
