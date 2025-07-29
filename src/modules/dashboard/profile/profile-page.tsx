import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Save, User, Mail, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import type { ApiError } from '@/types';

const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateProfile, isLoading } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  // Update form when user data changes
  React.useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            User information not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>
              Your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    First Name
                  </Label>
                  <p className="text-sm mt-1">
                    {user.firstName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </Label>
                  <p className="text-sm mt-1">
                    {user.lastName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </Label>
                  <p className="text-sm mt-1">
                    {user.fullName ||
                      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                      'Not provided'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
            <CardDescription>Your account details and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Email Address
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                User Type
              </Label>
              <p className="text-sm mt-1 font-medium text-primary">
                {user.userType}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Account Status
              </Label>
              <p
                className={`text-sm mt-1 font-medium ${
                  user.status === 'ACTIVE'
                    ? 'text-primary'
                    : user.status === 'INACTIVE'
                      ? 'text-muted-foreground'
                      : 'text-destructive'
                }`}
              >
                {user.status}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Account Created
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
