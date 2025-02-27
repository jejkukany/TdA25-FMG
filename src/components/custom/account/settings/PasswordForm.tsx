"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { client } from "@/server/auth/client";
import { useState } from "react";

export function PasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handlePasswordConfirm = async () => {
        setPasswordError("");
        setIsLoading(true);
        try {
            await client.changePassword({
                newPassword,
                currentPassword,
                revokeOtherSessions: true,
            });
            setCurrentPassword("");
            setNewPassword("");
            setIsOpen(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to change password";
            setPasswordError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); setIsOpen(true); }} className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={passwordError ? "border-destructive" : ""}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={passwordError ? "border-destructive" : ""}
                />
                {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                )}
            </div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger asChild>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Changing..." : "Change Password"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Password</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change your password? This will sign you out from all other devices.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePasswordConfirm}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
}