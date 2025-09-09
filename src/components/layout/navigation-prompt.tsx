
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
            You are in a focus session
          </AlertDialogTitle>
          <AlertDialogDescription>
            You can continue the session in the background or end it now.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelNavigation}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleStay}>
            Continue in Background
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            End Focus Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
