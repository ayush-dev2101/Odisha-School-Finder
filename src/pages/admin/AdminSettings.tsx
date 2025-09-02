import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Database, Bell, Shield, Globe, Mail } from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "SchoolHub",
    siteDescription: "Find and compare the best schools in your area",
    adminEmail: "admin@schoolhub.com",
    enableNotifications: true,
    enablePublicRegistration: true,
    enableSchoolRatings: true,
    moderateReviews: false,
    maxRatingPerUser: 1,
    enableEmailAlerts: true,
    maintenanceMode: false,
  });

  const handleSave = async () => {
    // Here you would typically save to your database
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      siteName: "SchoolHub",
      siteDescription: "Find and compare the best schools in your area",
      adminEmail: "admin@schoolhub.com",
      enableNotifications: true,
      enablePublicRegistration: true,
      enableSchoolRatings: true,
      moderateReviews: false,
      maxRatingPerUser: 1,
      enableEmailAlerts: true,
      maintenanceMode: false,
    });
    
    toast({
      title: "Reset Complete",
      description: "Settings reset to default values",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-2 h-6 w-6" />
            System Settings
          </h2>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleReset} variant="outline">
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-900 flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription className="text-gray-600">
              Basic site configuration and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="Enter site name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Enter site description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                placeholder="Enter admin email"
              />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-900 flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription className="text-gray-600">
              Control user registration and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Public Registration</Label>
                <p className="text-xs text-gray-500">Allow new users to register publicly</p>
              </div>
              <Switch
                checked={settings.enablePublicRegistration}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, enablePublicRegistration: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-500">Send email alerts to administrators</p>
              </div>
              <Switch
                checked={settings.enableEmailAlerts}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, enableEmailAlerts: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Maintenance Mode</Label>
                <p className="text-xs text-gray-500">Disable public access to the site</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Rating System */}
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-900 flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Rating System
            </CardTitle>
            <CardDescription className="text-gray-600">
              Configure school rating and review settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Enable School Ratings</Label>
                <p className="text-xs text-gray-500">Allow users to rate and review schools</p>
              </div>
              <Switch
                checked={settings.enableSchoolRatings}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, enableSchoolRatings: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Moderate Reviews</Label>
                <p className="text-xs text-gray-500">Require admin approval for reviews</p>
              </div>
              <Switch
                checked={settings.moderateReviews}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, moderateReviews: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="maxRating">Max Ratings Per User</Label>
              <Input
                id="maxRating"
                type="number"
                min="1"
                max="10"
                value={settings.maxRatingPerUser}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  maxRatingPerUser: parseInt(e.target.value) || 1 
                })}
              />
              <p className="text-xs text-gray-500">Maximum number of ratings a user can submit per school</p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-gray-900 flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-gray-600">
              Configure system notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">System Notifications</Label>
                <p className="text-xs text-gray-500">Enable system-wide notifications</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, enableNotifications: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-sm font-medium">Email Alert Triggers</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="newUser" className="rounded" defaultChecked />
                  <Label htmlFor="newUser" className="text-sm">New user registration</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="newReview" className="rounded" defaultChecked />
                  <Label htmlFor="newReview" className="text-sm">New school review</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="reportedContent" className="rounded" defaultChecked />
                  <Label htmlFor="reportedContent" className="text-sm">Reported content</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="systemErrors" className="rounded" />
                  <Label htmlFor="systemErrors" className="text-sm">System errors</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Actions */}
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-gray-900 flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Database Management
          </CardTitle>
          <CardDescription className="text-gray-600">
            Perform database maintenance and backup operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Database className="h-6 w-6 mb-2" />
              <span>Backup Database</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span>Optimize Tables</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              <span>Test Email</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;