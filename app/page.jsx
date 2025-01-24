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
import Image from "next/image";

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
          <div className="flex items-center justify-end gap-2 flex-row-reverse mb-2">
            <DialogTitle>Telegram Bot Settings</DialogTitle>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
            >
              <path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z" />
            </svg>
          </div>
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
