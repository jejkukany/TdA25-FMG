"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { client } from "@/server/auth/client";
import { useState } from "react";

export function EmailForm() {
    const [newEmail, setNewEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleEmailConfirm = async () => {
        setEmailError("");
        setIsLoading(true);
        try {
            await client.changeEmail({
                newEmail,
                callbackURL: "/settings",
            });
            setNewEmail("");
            setIsOpen(false);
        } catch (error: any) {
            setEmailError(error.message || "Failed to change email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); setIsOpen(true); }} className="space-y-4">
            <h3 className="text-lg font-medium">Change Email</h3>
            <div className="space-y-2">
                <Label htmlFor="newEmail">New Email</Label>
                <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={emailError ? "border-destructive" : ""}
                />
                {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                )}
            </div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger asChild>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Changing..." : "Change Email"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Email</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change your email to "{newEmail}"? You will need to verify your new email address.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleEmailConfirm}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
}