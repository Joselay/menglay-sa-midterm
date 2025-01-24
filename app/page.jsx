"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useTelegramStore from "./stores/telegramStore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

export default function DialogDemo() {
  const { botToken, chatId, setBotToken, setChatId } = useTelegramStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSaveSettings = () => {
    if (!botToken || !chatId) {
      toast({
        title: "Error",
        description: (
          <div className="flex items-center gap-2 mt-2">
            <X className="h-6 w-6 text-red-500" />
            <span>Please fill in all settings fields.</span>
          </div>
        ),
      });
      return;
    }

    toast({
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>Your settings have been saved successfully.</span>
        </div>
      ),
    });

    router.push("/product");
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Telegram Bot Settings</DialogTitle>
          <DialogDescription>
            Configure your Telegram bot token and chat ID here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="botToken" className="text-right">
              Bot Token
            </Label>
            <Input
              id="botToken"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chatId" className="text-right">
              Chat ID
            </Label>
            <Input
              id="chatId"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
