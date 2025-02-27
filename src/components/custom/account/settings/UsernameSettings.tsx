"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { client } from "@/server/auth/client";
import { useState } from "react";

export function UsernameSettings() {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleUsernameConfirm = async () => {
        setNameError("");
        setIsLoading(true);
        try {
            if (!name.trim()) {
                setNameError("Username cannot be empty");
                return;
            }
            const updateUser = await client.updateUser({
                name: name,
                username: name,
            });
            if (updateUser.error) {
                setNameError(updateUser.error.message || "Failed to update username");
                return;
            }
            setName("");
            setIsOpen(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update username";
            setNameError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); setIsOpen(true); }} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Username</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter new username"
                            className={nameError ? "border-destructive" : ""}
                        />
                        {nameError && (
                            <p className="text-sm text-destructive">{nameError}</p>
                        )}
                    </div>
                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogTrigger asChild>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Username"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Change Username</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to change your username to &quot;{name}&quot;?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleUsernameConfirm}>
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </form>
            </CardContent>
        </Card>
    );
}