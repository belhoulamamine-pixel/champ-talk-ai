import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (apiKey: string) => void;
  currentKey: string;
}

const ApiKeyDialog = ({ open, onOpenChange, onSave, currentKey }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState(currentKey);

  const handleSave = () => {
    onSave(apiKey);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>OpenRouter API Settings</DialogTitle>
          <DialogDescription>
            Enter your OpenRouter API key to start chatting with champions. Your key is stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Don't have an API key?</p>
            <p className="text-sm text-muted-foreground">
              Get a free API key from OpenRouter to start chatting. The free tier includes access to several models.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => window.open("https://openrouter.ai/keys", "_blank")}
            >
              Get API Key <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save API Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
