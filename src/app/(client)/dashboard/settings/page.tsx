"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  User,
  Bell,
  ShieldCheck,
  Palette,
  Globe,
  CreditCard,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    interviews: true,
    results: true,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
    analytics: true
  });
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "data", label: "Data & Export", icon: Download }
  ];

  const ProfileSettings = () => (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Personal Information</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              <textarea
                rows={3}
                defaultValue="Software engineer with 5+ years of experience in full-stack development."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Change Password</CardTitle>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Email Notifications</CardTitle>
          <div className="space-y-4">
            {Object.entries({
              email: "Email notifications",
              interviews: "Interview reminders",
              results: "Interview results",
              marketing: "Marketing updates"
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{label}</p>
                  <p className="text-sm text-slate-500">Receive {label.toLowerCase()} via email</p>
                </div>
                <Switch
                  checked={notifications[key as keyof typeof notifications]}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Push Notifications</CardTitle>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Browser notifications</p>
              <p className="text-sm text-slate-500">Receive push notifications in your browser</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, push: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PrivacySettings = () => (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Privacy Settings</CardTitle>
          <div className="space-y-4">
            {Object.entries({
              profileVisible: "Make profile visible to other users",
              dataSharing: "Share anonymized data for research",
              analytics: "Allow analytics tracking"
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{label}</p>
                  <p className="text-sm text-slate-500">
                    {key === 'profileVisible' && "Other users can see your profile information"}
                    {key === 'dataSharing' && "Help improve our AI models with anonymized data"}
                    {key === 'analytics' && "Help us improve the platform with usage analytics"}
                  </p>
                </div>
                <Switch
                  checked={privacy[key as keyof typeof privacy]}
                  onCheckedChange={(checked) =>
                    setPrivacy(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-red-600 mb-4">Danger Zone</CardTitle>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AppearanceSettings = () => (
    <Card className="border border-slate-200 shadow-sm rounded-xl">
      <CardContent className="p-6">
        <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Theme Preferences</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Light", "Dark", "System"].map((theme) => (
            <div
              key={theme}
              className="p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-violet-500 transition-colors"
            >
              <div className={`w-full h-20 rounded mb-3 ${
                theme === "Light" ? "bg-white border border-slate-200" :
                theme === "Dark" ? "bg-slate-900" : "bg-gradient-to-r from-white to-slate-900"
              }`}></div>
              <p className="font-medium text-center text-slate-900">{theme}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const BillingSettings = () => (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Current Plan</CardTitle>
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-6 rounded-xl border border-violet-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-violet-900">Free Plan</h3>
                <p className="text-violet-700">10 interviews per month</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-violet-900">$0</p>
                <p className="text-sm text-violet-700">per month</p>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Usage This Month</CardTitle>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Interviews Used</span>
                <span className="text-sm font-medium text-slate-900">3 / 10</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-violet-600 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DataSettings = () => (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Export Data</CardTitle>
          <p className="text-slate-600 mb-4">
            Download a copy of your data including interviews, responses, and analytics.
          </p>
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Data Usage</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">127</p>
              <p className="text-sm text-blue-700">Total Interviews</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-600">2.3 GB</p>
              <p className="text-sm text-emerald-700">Data Stored</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-2xl font-bold text-purple-600">45 hrs</p>
              <p className="text-sm text-purple-700">Total Duration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileSettings />;
      case "notifications": return <NotificationSettings />;
      case "privacy": return <PrivacySettings />;
      case "appearance": return <AppearanceSettings />;
      case "billing": return <BillingSettings />;
      case "data": return <DataSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center">
            <Settings className="w-10 h-10 text-violet-600 mr-3" />
            Settings
          </h1>
          <p className="text-lg text-slate-600">
            Manage your account preferences and application settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card className="border border-slate-200 shadow-sm rounded-xl sticky top-6 bg-white">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                            : "text-slate-700 hover:bg-slate-50 hover:text-violet-600"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 px-8">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
