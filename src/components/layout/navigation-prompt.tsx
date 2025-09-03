
"use client";

import { useWorkspace } from "@/context/workspace-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export function NavigationPrompt() {
  const { 
    isPromptOpen, 
    nextPath, 
    confirmNavigation, 
    cancelNavigation, 
    endSession,
    sessionType
  } = useWorkspace();
  
  const router = useRouter();

  const handleConfirm = () => {
    endSession();
    confirmNavigation();
    if(nextPath) router.push(nextPath);
  };
  
  const handleStay = () => {
    confirmNavigation();
     if(nextPath) router.push(nextPath);
  }

  const isSoloSession = sessionType === 'solo';

  return (
    <AlertDialog open={isPromptOpen} onOpenChange={cancelNavigation}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isSoloSession ? "You are in a focus session" : "You are in an active call"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSoloSession 
              ? "You can continue the session in the background or end it now."
              : "You can stay in the call and browse other pages, or end the call and leave."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelNavigation}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleStay}>
            {isSoloSession ? "Continue in Background" : "Stay in Call"}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isSoloSession ? "End Focus Session" : "End Call & Leave"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
