import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Save, Building2, Mail, Phone, Percent } from 'lucide-react';
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
import { affiliateService } from '@/services';
import type { ApiError } from '@/types';

const affiliateAccountSchema = z.object({
  name: z
    .string()
    .min(2, 'Affiliate name must be at least 2 characters')
    .max(100, 'Affiliate name must not exceed 100 characters'),
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must not exceed 100 characters'),
  primaryContactEmail: z.string().email('Please enter a valid email address'),
  primaryContactPhone: z.string().optional().or(z.literal('')),
});

type AffiliateAccountFormData = z.infer<typeof affiliateAccountSchema>;

export const AffiliateAccountPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: affiliate, isLoading } = useQuery({
    queryKey: ['affiliate', 'profile'],
    queryFn: affiliateService.getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: affiliateService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate', 'profile'] });
      toast.success('Affiliate account updated successfully');
      setIsEditing(false);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update affiliate account');
    },
  });

  const form = useForm<AffiliateAccountFormData>({
    resolver: zodResolver(affiliateAccountSchema),
    defaultValues: {
      name: '',
      businessName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
    },
  });

  // Update form when affiliate data loads
  React.useEffect(() => {
    if (affiliate) {
      form.reset({
        name: affiliate.name,
        businessName: affiliate.businessName,
        primaryContactEmail: affiliate.primaryContactEmail,
        primaryContactPhone: affiliate.primaryContactPhone || '',
      });
    }
  }, [affiliate, form]);

  const onSubmit = async (data: AffiliateAccountFormData) => {
    const updateData = {
      ...data,
      primaryContactPhone: data.primaryContactPhone || undefined,
    };
    updateMutation.mutate(updateData);
  };

  const handleCancel = () => {
    if (affiliate) {
      form.reset({
        name: affiliate.name,
        businessName: affiliate.businessName,
        primaryContactEmail: affiliate.primaryContactEmail,
        primaryContactPhone: affiliate.primaryContactPhone || '',
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">
            Loading affiliate account...
          </p>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Affiliate account not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Affiliate Account
          </h1>
          <p className="text-muted-foreground">
            Manage your affiliate business information and settings
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Account</Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Business Information</span>
            </CardTitle>
            <CardDescription>
              Your affiliate business details and contact information
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiliate Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryContactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
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
                    Affiliate Name
                  </Label>
                  <p className="text-sm mt-1">{affiliate.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Business Name
                  </Label>
                  <p className="text-sm mt-1">{affiliate.businessName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Primary Contact Email
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{affiliate.primaryContactEmail}</p>
                  </div>
                </div>
                {affiliate.primaryContactPhone && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Primary Contact Phone
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{affiliate.primaryContactPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Percent className="h-5 w-5" />
              <span>Account Details</span>
            </CardTitle>
            <CardDescription>
              Your affiliate account status and commission information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Account Status
              </Label>
              <p className="text-sm mt-1 font-medium text-primary">
                {affiliate.status}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Default Commission Rate
              </Label>
              <p className="text-sm mt-1 font-medium">
                {(affiliate.defaultCommissionRate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Account Balance
              </Label>
              <p className="text-sm mt-1 font-medium text-primary">
                ${affiliate.accountBalance.toFixed(2)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Account Created
              </Label>
              <p className="text-sm mt-1">{formatDate(affiliate.createdAt)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </Label>
              <p className="text-sm mt-1">{formatDate(affiliate.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {affiliate._count && (
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>
              Overview of your affiliate performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {affiliate._count.users}
                </p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {affiliate._count.organizations}
                </p>
                <p className="text-sm text-muted-foreground">Organizations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {affiliate._count.commissions}
                </p>
                <p className="text-sm text-muted-foreground">Commissions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {affiliate._count.soldSubscriptions}
                </p>
                <p className="text-sm text-muted-foreground">
                  Subscriptions Sold
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
