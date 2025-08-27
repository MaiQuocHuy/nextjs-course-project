"use client";
import { DialogTrigger } from "@/components/ui/dialog";
import { ReSubmitApplicationForm } from "@/components/settings/ReSubmitApplicationForm";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useUpdateThumbnailMutation,
  useGetApplicationDetailQuery,
} from "@/services/common/settingsApi";
import {
  Edit2,
  User,
  Shield,
  Camera,
  RefreshCw,
  CheckCircle,
  ArrowLeft,
  Globe,
  FileText,
  Award,
  Paperclip,
  FileUser,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useGetProfileQuery } from "@/services/common/profileApi";
import { useAuth } from "@/hooks/useAuth";
import { FileDisplay } from "@/components/settings/FileDisplay";
import { useRouter, useSearchParams } from "next/navigation";

// Avatar constraints
const MAX_AVATAR_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];

// Validation schemas
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().default("").optional(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string(),
    // .min(8, "Password must be at least 8 characters")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Types
type PersonalInfoForm = z.infer<typeof personalInfoSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// Reusable editable field component
interface EditableFieldProps {
  field: keyof PersonalInfoForm;
  label: string;
  type?: "text" | "textarea";
  isEditing: boolean;
  onToggle: () => void;
  form: UseFormReturn<PersonalInfoForm>;
  currentValue: string;
  originalValue: string;
}

const EditableField = React.memo(
  ({
    field,
    label,
    type = "text",
    isEditing,
    onToggle,
    form,
    currentValue,
    originalValue,
  }: EditableFieldProps) => {
    const isChanged = currentValue !== originalValue;
    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex-1">
              <FormField
                control={form.control}
                name={field}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormControl>
                      {type === "textarea" ? (
                        <Textarea
                          {...formField}
                          className="flex-1 min-h-[100px]"
                          autoFocus={!isChanged}
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <Input
                          {...formField}
                          type={type}
                          className="flex-1"
                          autoFocus={!isChanged}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div
              className={`flex-1 py-2 px-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted/70 ${
                type === "textarea" ? "min-h-[100px] whitespace-pre-wrap" : ""
              }`}
              onClick={onToggle}
            >
              {currentValue || (type === "textarea" ? "Click to add bio..." : "")}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
            aria-label={isEditing ? `Reset ${label}` : `Edit ${label}`}
          >
            {isEditing ? <RefreshCw className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }
);
EditableField.displayName = "EditableField";

export default function SettingsPage() {
  // API import
  const { refreshSession, user } = useAuth();
  const userRole = user?.role;
  const userId = user?.id;
  const { data: profileResponse } = useGetProfileQuery();
  const { data: applicationResponse, isLoading: isLoadingApplication } =
    useGetApplicationDetailQuery(userId as string);

  // manage tab
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultTab = searchParams.get("tab") || "personal";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // API Mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updateThumbnail, { isLoading: isUpdatingThumbnail }] = useUpdateThumbnailMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: profileResponse?.data?.name || "",
    bio: profileResponse?.data?.bio || "",
  });
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Password State
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  // ReSubmit Application State
  const [showReSubmitDialog, setShowReSubmitDialog] = useState(false);

  // Forms
  const personalForm = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  // Sync form with loaded profile
  useEffect(() => {
    if (profileResponse?.data) {
      const next = {
        name: profileResponse.data.name || "",
        bio: profileResponse.data.bio || "",
      };
      setPersonalInfo(next);
      personalForm.reset(next);
      setAvatarUrl(profileResponse.data.thumbnailUrl || null);
    }
  }, [profileResponse, personalForm]);

  // Watched values & change detection
  const watchedName = personalForm.watch("name");
  const watchedBio = personalForm.watch("bio");
  const hasPersonalChanges = useMemo(
    () => watchedName !== personalInfo.name || (watchedBio || "") !== personalInfo.bio,
    [watchedName, watchedBio, personalInfo]
  );

  const setSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setShowSuccessDialog(true);
  }, []);

  const handlePersonalInfoUpdate = useCallback(
    async (data: PersonalInfoForm) => {
      try {
        if (!hasPersonalChanges) {
          return;
        }
        const trimmedName = data.name.trim();
        if (!trimmedName) {
          setSuccess("Name is required");
          return;
        }
        const payload = { name: trimmedName, bio: data.bio || "" };
        await updateProfile(payload).unwrap();
        setPersonalInfo(payload);
        setEditingFields({});

        // Force session refresh to update header
        await refreshSession();

        setSuccess("Profile updated successfully");
      } catch (error: any) {
        console.error("Profile update failed", error);
        let message = "Failed to update profile. Please try again.";
        if (error?.status === 400) message = "Invalid data provided.";
        else if (error?.status === 401 || error?.status === 403) message = "Not authorized.";
        else if (error?.status === 422) message = "Validation error.";
        else if (error?.status === 500) message = error?.data?.message || "Server error.";
        else if (error?.data?.message) message = error.data.message;
        setSuccess(message);
      }
    },
    [hasPersonalChanges, updateProfile, refreshSession, setSuccess]
  );

  const handlePasswordUpdate = useCallback(
    async (data: PasswordForm) => {
      try {
        await resetPassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }).unwrap();
        passwordForm.reset();
        setIsPasswordDialogOpen(false);
        setShowPasswordSuccess(true);
      } catch (error: any) {
        console.error("Password update failed", error);
        if (error?.data?.message?.includes("incorrect") || error?.status === 401) {
          passwordForm.setError("oldPassword", { message: "Current password is incorrect" });
        } else {
          passwordForm.setError("root", {
            message: "Failed to update password. Please try again.",
          });
        }
      }
    },
    [resetPassword, passwordForm]
  );

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setSuccess("Unsupported image format. Please upload JPEG, PNG, GIF, BMP, or WebP.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setSuccess("Image is too large. Maximum size is 10MB.");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
      setIsAvatarDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarSave = useCallback(async () => {
    if (!avatarPreview || !avatarFile) return;
    try {
      await updateThumbnail({
        thumbnail: avatarFile,
        currentName: personalInfo.name,
      }).unwrap();
      setAvatarUrl(avatarPreview);
      setAvatarPreview(null);
      setAvatarFile(null);
      setIsAvatarDialogOpen(false);

      // Force session refresh to update header avatar
      await refreshSession();

      setSuccess("Avatar updated successfully");
    } catch (error) {
      console.error("Avatar update failed", error);
      setSuccess("Failed to update avatar. Please try again.");
    }
  }, [avatarPreview, avatarFile, updateThumbnail, personalInfo.name, refreshSession, setSuccess]);

  const toggleEditField = (field: keyof PersonalInfoForm) => {
    setEditingFields((prev) => ({ ...prev, [field]: !prev[field] }));
    if (editingFields[field]) {
      // Reset to original when toggling off
      personalForm.setValue(field, personalInfo[field]);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.replace(`?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#e5ecff]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
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

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  {userRole === "INSTRUCTOR" ? (
                    <TabsTrigger
                      value="application"
                      className="lg:justify-start lg:px-4 lg:py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 data-[state=active]:shadow-sm hover:bg-gray-50 transition-all duration-200"
                    >
                      <FileUser className="h-4 w-4 mr-2" />
                      Application
                    </TabsTrigger>
                  ) : null}
                </TabsList>
              </div>
            </div>

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
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={avatarUrl || profileResponse?.data?.thumbnailUrl || ""}
                            alt="Profile picture"
                          />
                          <AvatarFallback>
                            {personalInfo.name
                              .split(" ")
                              .map((n: string) => n[0])
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
                          accept="image/jpeg,image/png,image/gif,image/bmp,image/webp"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">
                          Click the camera icon to upload a new avatar
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported: JPEG, PNG, GIF, BMP, WebP. Max size: 10MB
                        </p>
                      </div>
                    </div>

                    <Form {...personalForm}>
                      <form
                        onSubmit={personalForm.handleSubmit(handlePersonalInfoUpdate)}
                        className="space-y-4"
                      >
                        <EditableField
                          field="name"
                          label="Full Name"
                          type="text"
                          isEditing={!!editingFields.name}
                          onToggle={() => toggleEditField("name")}
                          form={personalForm}
                          currentValue={watchedName}
                          originalValue={personalInfo.name}
                        />
                        <EditableField
                          field="bio"
                          label="Bio"
                          type="textarea"
                          isEditing={!!editingFields.bio}
                          onToggle={() => toggleEditField("bio")}
                          form={personalForm}
                          currentValue={watchedBio || ""}
                          originalValue={personalInfo.bio}
                        />
                        <div className="pt-6 flex justify-end border-t border-gray-100">
                          <Button
                            type="submit"
                            disabled={!hasPersonalChanges || isUpdatingProfile}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUpdatingProfile ? "Updating..." : "Update Profile"}
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
                                    disabled={isResettingPassword}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={
                                      !passwordForm.formState.isValid || isResettingPassword
                                    }
                                  >
                                    {isResettingPassword ? "Updating..." : "Update Password"}
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

              <TabsContent value="application" className="mt-0">
                <Card className="shadow-sm border-0 bg-white">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-xl text-gray-900">Application Details</CardTitle>
                    <CardDescription className="text-gray-600">
                      View your instructor application information and uploaded documents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {isLoadingApplication ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">Loading application details...</div>
                      </div>
                    ) : applicationResponse?.data ? (
                      (() => {
                        // Parse documents if they exist
                        const documents = applicationResponse.data.documents
                          ? typeof applicationResponse.data.documents === "string"
                            ? (() => {
                                try {
                                  return JSON.parse(applicationResponse.data.documents);
                                } catch {
                                  return null;
                                }
                              })()
                            : applicationResponse.data.documents
                          : null;

                        return (
                          <div className="space-y-6">
                            {/* Header with Status and Date */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/30">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  Application Status
                                </h3>
                                <div className="flex flex-col gap-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                                      applicationResponse.data.status === "APPROVED"
                                        ? "bg-green-100 text-green-700"
                                        : applicationResponse.data.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {applicationResponse.data.status}
                                  </span>
                                </div>
                              </div>
                              {applicationResponse.data.submittedAt && (
                                <div className="text-sm text-gray-600">
                                  Submitted:{" "}
                                  {new Date(
                                    applicationResponse.data.submittedAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Show rejection reason if application was rejected */}
                            {applicationResponse.data.status === "REJECTED" &&
                              applicationResponse.data.rejectionReason && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-sm font-medium text-red-800 mb-1">
                                    Rejection Reason:
                                  </p>
                                  <p className="text-sm text-red-700">
                                    {applicationResponse.data.rejectionReason}
                                  </p>
                                </div>
                              )}

                            {/* Re-Submit Button Section - Outside rejection reason */}
                            {applicationResponse.data.status === "REJECTED" && (
                              <>
                                {applicationResponse.data.submitAttemptRemain === 0 ? (
                                  /* No attempts remaining - show contact admin notification */
                                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                                    <div className="flex items-start gap-3">
                                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-orange-900 mb-1">
                                          No Attempts Remaining
                                        </h4>
                                        <p className="text-sm text-orange-800 mb-3">
                                          You have used all available submission attempts for your
                                          instructor application.
                                        </p>
                                        <p className="text-sm text-orange-700">
                                          <strong>Need help?</strong> Please contact our support
                                          team or an administrator for assistance with your
                                          application.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Attempts remaining - show button with counter */
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-lg bg-blue-50/30">
                                    {/* Attempts remaining on the left */}
                                    <div className="flex items-center">
                                      {applicationResponse.data.submitAttemptRemain !==
                                        undefined && (
                                        <span className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg font-medium border">
                                          {applicationResponse.data.submitAttemptRemain} attempt(s)
                                          remaining
                                        </span>
                                      )}
                                    </div>

                                    {/* Re-Submit button on the right */}
                                    <div className="flex items-center">
                                      <Button
                                        onClick={() => setShowReSubmitDialog(true)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 text-sm font-medium"
                                      >
                                        Re-Submit Application
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Documents Section */}
                            <div className="space-y-6">
                              <h3 className="text-xl font-bold text-gray-900">Documents</h3>

                              {documents ? (
                                <div className="space-y-6">
                                  {/* Portfolio */}
                                  <div className="space-y-3">
                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                      <Globe className="h-5 w-5" />
                                      Portfolio
                                    </h4>
                                    {documents.portfolio ? (
                                      <FileDisplay file={documents.portfolio} label="Portfolio" />
                                    ) : (
                                      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 text-sm">
                                          No portfolio provided
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* CV */}
                                  <div className="space-y-3">
                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                      <FileText className="h-5 w-5" />
                                      CV
                                    </h4>
                                    {documents.cv ? (
                                      <FileDisplay file={documents.cv} label="Curriculum Vitae" />
                                    ) : (
                                      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 text-sm">No CV uploaded</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Certificate */}
                                  <div className="space-y-3">
                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                      <Award className="h-5 w-5" />
                                      Certificate
                                    </h4>
                                    {documents.certificate ? (
                                      <FileDisplay
                                        file={documents.certificate}
                                        label="Certificate"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 text-sm">
                                          No certificate uploaded
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Other Documents */}
                                  <div className="space-y-3">
                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                      <Paperclip className="h-5 w-5" />
                                      Other Documents
                                    </h4>
                                    {documents.other ? (
                                      <FileDisplay file={documents.other} label="Other Document" />
                                    ) : (
                                      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 text-sm">
                                          No other documents uploaded
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                  <p className="text-gray-500">
                                    No documents available for this application
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">No application data found</div>
                        <p className="text-sm text-gray-400">
                          Your instructor application details will appear here once available.
                        </p>
                      </div>
                    )}
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
                      src={avatarPreview}
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
                  setAvatarFile(null);
                }}
                disabled={isUpdatingThumbnail}
              >
                Cancel
              </Button>
              <Button onClick={handleAvatarSave} disabled={isUpdatingThumbnail}>
                {isUpdatingThumbnail ? "Saving..." : "Save Avatar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Dialog for Profile & Avatar */}
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

        {/* Re-Submit Application Dialog */}
        <Dialog open={showReSubmitDialog} onOpenChange={setShowReSubmitDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Re-Submit Application</DialogTitle>
            </DialogHeader>
            <ReSubmitApplicationForm
              onSuccess={() => {
                setShowReSubmitDialog(false);
              }}
              onCancel={() => setShowReSubmitDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
