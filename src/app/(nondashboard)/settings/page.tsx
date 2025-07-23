"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit2, User, Shield, Camera, RefreshCw, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schemas
const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
  });
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=100&width=100&text=JD");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Password State
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const personalForm = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const hasPersonalChanges = () => {
    const currentValues = personalForm.getValues();
    return (
      currentValues.fullName !== personalInfo.fullName || currentValues.email !== personalInfo.email
    );
  };

  const handlePersonalInfoUpdate = (data: PersonalInfoForm) => {
    setPersonalInfo(data);
    setEditingFields({});
    setSuccessMessage("Profile updated successfully");
    setShowSuccessDialog(true);
  };

  const handlePasswordUpdate = (data: PasswordForm) => {
    // Simulate password validation
    if (data.oldPassword !== "Password123") {
      passwordForm.setError("oldPassword", {
        message: "Current password is incorrect",
      });
      return;
    }

    passwordForm.reset();
    setIsPasswordDialogOpen(false);
    setShowPasswordSuccess(true);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
        setIsAvatarDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSave = () => {
    if (avatarPreview) {
      setAvatarUrl(avatarPreview);
      setAvatarPreview(null);
      setIsAvatarDialogOpen(false);
      setSuccessMessage("Avatar updated successfully");
      setShowSuccessDialog(true);
    }
  };

  const startEditing = (field: keyof PersonalInfoForm) => {
    setEditingFields((prev) => ({ ...prev, [field]: true }));
  };

  const resetField = (field: keyof PersonalInfoForm) => {
    personalForm.setValue(field, personalInfo[field]);
    setEditingFields((prev) => ({ ...prev, [field]: false }));
  };

  const isFieldChanged = (field: keyof PersonalInfoForm) => {
    return personalForm.getValues(field) !== personalInfo[field];
  };

  const EditableField = ({
    field,
    value,
    label,
    type = "text",
  }: {
    field: keyof PersonalInfoForm;
    value: string;
    label: string;
    type?: string;
  }) => {
    const isEditing = editingFields[field];
    const isChanged = isFieldChanged(field);

    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex-1">
              <FormField
                control={personalForm.control}
                name={field}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...formField} type={type} className="flex-1" autoFocus={!isChanged} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <>
              <div
                className="flex-1 py-2 px-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted/70"
                onClick={() => startEditing(field)}
              >
                {personalForm.getValues(field)}
              </div>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (isEditing ? resetField(field) : startEditing(field))}
            className="h-8 w-8 p-0"
          >
            {isEditing ? <RefreshCw className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#e5ecff]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Add back button and header */}
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4 hover:bg-white/50"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Enhanced Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-2">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-1 lg:h-auto lg:space-y-2 bg-transparent">
                  <TabsTrigger
                    value="personal"
                    className="lg:justify-start lg:px-4 lg:py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 data-[state=active]:shadow-sm hover:bg-gray-50 transition-all duration-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="lg:justify-start lg:px-4 lg:py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 data-[state=active]:shadow-sm hover:bg-gray-50 transition-all duration-200"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Enhanced Content Panel */}
            <div className="lg:col-span-3">
              <TabsContent value="personal" className="mt-0">
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-xl text-gray-900">Personal Information</CardTitle>
                    <CardDescription className="text-gray-600">
                      Update your personal details and profile picture.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={avatarUrl || "/placeholder.svg"}
                            alt="Profile picture"
                          />
                          <AvatarFallback>
                            {personalInfo.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <label
                          htmlFor="avatar-upload"
                          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                        >
                          <Camera className="h-3 w-3" />
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">
                          Click the camera icon to upload a new avatar
                        </p>
                      </div>
                    </div>

                    {/* Personal Info Form */}
                    <Form {...personalForm}>
                      <form
                        onSubmit={personalForm.handleSubmit(handlePersonalInfoUpdate)}
                        className="space-y-4"
                      >
                        <EditableField
                          field="fullName"
                          value={personalInfo.fullName}
                          label="Full Name"
                        />
                        <EditableField
                          field="email"
                          value={personalInfo.email}
                          label="Email Address"
                          type="email"
                        />

                        <div className="pt-6 flex justify-end border-t border-gray-100">
                          <Button
                            type="submit"
                            disabled={!hasPersonalChanges() || !personalForm.formState.isValid}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          >
                            Update Profile
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-xl text-gray-900">Security</CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage your account security settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg bg-gray-50/30 hover:bg-gray-50/50 transition-colors">
                        <div>
                          <h3 className="font-semibold text-gray-900">Password</h3>
                          <p className="text-sm text-gray-600">Change your account password</p>
                        </div>
                        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">Change Password</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Change Password</DialogTitle>
                              <DialogDescription>
                                Enter your current password and choose a new one.
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...passwordForm}>
                              <form
                                onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}
                                className="space-y-4"
                              >
                                <FormField
                                  control={passwordForm.control}
                                  name="oldPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Current Password</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={passwordForm.control}
                                  name="newPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>New Password</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={passwordForm.control}
                                  name="confirmPassword"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Confirm New Password</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsPasswordDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={!passwordForm.formState.isValid}>
                                    Update Password
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>

        {/* Avatar Preview Dialog */}
        <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Preview Your Avatar</DialogTitle>
              <DialogDescription>Confirm your new profile picture.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border">
                  {avatarPreview && (
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAvatarDialogOpen(false);
                  setAvatarPreview(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAvatarSave}>Save Avatar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Dialog for Profile Updates */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-center">Success</DialogTitle>
              <DialogDescription className="text-center">{successMessage}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog for Password Update */}
        <Dialog open={showPasswordSuccess} onOpenChange={setShowPasswordSuccess}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-center">Password Updated</DialogTitle>
              <DialogDescription className="text-center">
                Your password has been updated successfully.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button onClick={() => setShowPasswordSuccess(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
