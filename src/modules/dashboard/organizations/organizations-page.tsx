import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Search, Filter, Users, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { affiliateService } from '@/services';
import { INDUSTRY_TYPES } from '@/constants';

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'TRIAL':
      return 'secondary';
    case 'INACTIVE':
      return 'outline';
    case 'SUSPENDED':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const OrganizationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['affiliate', 'organizations'],
    queryFn: affiliateService.getOrganizations,
  });

  const filteredOrganizations = organizations.filter((organization) => {
    const matchesSearch =
      organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organization.businessName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      organization.primaryContactEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || organization.status === statusFilter;

    const matchesIndustry =
      industryFilter === 'all' || organization.industryType === industryFilter;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const stats = [
    {
      title: 'Total Organizations',
      value: organizations.length,
      description: 'Organizations you manage',
      icon: Building2,
    },
    {
      title: 'Active Organizations',
      value: organizations.filter((org) => org.status === 'ACTIVE').length,
      description: 'Currently active',
      icon: Building2,
    },
    {
      title: 'Total Users',
      value: organizations.reduce(
        (sum, org) => sum + (org._count?.users || 0),
        0
      ),
      description: 'Across all organizations',
      icon: Users,
    },
    {
      title: 'Total Subscriptions',
      value: organizations.reduce(
        (sum, org) => sum + (org._count?.subscriptions || 0),
        0
      ),
      description: 'Active subscriptions',
      icon: Calendar,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getIndustryLabel = (industryType: string) => {
    const industry = INDUSTRY_TYPES.find((type) => type.value === industryType);
    return industry?.label || industryType;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
        <p className="text-muted-foreground">
          Manage organizations you're affiliated with
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            Organizations you are affiliated with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="TRIAL">Trial</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {INDUSTRY_TYPES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">
                Loading organizations...
              </p>
            </div>
          ) : filteredOrganizations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrganizations.map((organization) => (
                <Card
                  key={organization.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {organization.name}
                        </CardTitle>
                        <CardDescription>
                          {organization.businessName}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={getStatusBadgeVariant(organization.status)}
                      >
                        {organization.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{getIndustryLabel(organization.industryType)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{organization._count?.users || 0} users</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(organization.createdAt)}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        Contact: {organization.primaryContactEmail}
                      </p>
                      {organization.primaryContactPhone && (
                        <p className="text-sm text-muted-foreground">
                          Phone: {organization.primaryContactPhone}
                        </p>
                      )}
                      {organization.customCommissionRate && (
                        <p className="text-sm font-medium text-primary">
                          Custom Rate:{' '}
                          {(organization.customCommissionRate * 100).toFixed(1)}
                          %
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No organizations found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
