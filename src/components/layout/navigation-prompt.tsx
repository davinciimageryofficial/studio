
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
import { useEffect } from "react";

export function NavigationPrompt() {
  const { isPromptOpen, confirmNavigation, cancelNavigation, endSession } = useWorkspace();
  const router = useRouter();

  // This is a bit of a hack to get the next path from the context,
  // because the router doesn't expose it directly.
  const nextPathRef =
    (useContext: any) =>
    () => {
      return useContext().nextPath;
    };
  const getNextPath = nextPathRef(useWorkspace);

  const handleConfirm = () => {
    const nextPath = getNextPath();
    endSession();
    confirmNavigation();
    if(nextPath) router.push(nextPath);
  };
  
  const handleStay = () => {
    const nextPath = getNextPath();
    confirmNavigation();
     if(nextPath) router.push(nextPath);
  }

  return (
    <AlertDialog open={isPromptOpen} onOpenChange={cancelNavigation}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You are in an active session</AlertDialogTitle>
          <AlertDialogDescription>
            You can stay in the call and browse other pages, or end the call and leave.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelNavigation}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleStay}>Stay in Call</AlertDialogAction>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            End Call & Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
