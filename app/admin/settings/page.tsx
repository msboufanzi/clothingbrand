"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lock, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [adminData, setAdminData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [smtpSettings, setSmtpSettings] = useState({
    host: "",
    port: "587",
    username: "",
    password: "",
    fromEmail: "",
    fromName: "Echaly Fashion",
  })

  const [emailNotifications, setEmailNotifications] = useState({
    newOrders: true,
    orderStatusChanges: true,
    lowStock: true,
    newCustomers: true,
    returns: false,
  })

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "admin",
  })

  useEffect(() => {
    async function fetchAdminData() {
      try {
        setIsLoading(true)
        setError(null)

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Auth error:", userError)
          setError("Authentication error. Please log in again.")
          return
        }

        if (!user) {
          setError("No authenticated user found. Please log in again.")
          return
        }

        // Get admin data
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("auth_id", user.id)
          .single()

        if (adminError) {
          console.error("Admin user error:", adminError)
          setError("Failed to load admin data. Please refresh the page.")
          return
        }

        if (!adminUser) {
          setError("Admin user not found. Please contact support.")
          return
        }

        setAdminData(adminUser)
        setPersonalInfo({
          firstName: adminUser.first_name || "",
          lastName: adminUser.last_name || "",
          email: adminUser.email || "",
          role: adminUser.role || "admin",
        })

        // Try to get admin settings if they exist
        try {
          const { data: settings, error: settingsError } = await supabase
            .from("admin_settings")
            .select("*")
            .eq("admin_id", adminUser.id)
            .maybeSingle()

          if (settingsError && settingsError.code !== "PGRST116") {
            throw settingsError
          }

          if (settings) {
            // Update state with saved settings
            setSmtpSettings({
              host: settings.smtp_host || "",
              port: settings.smtp_port || "587",
              username: settings.smtp_username || "",
              password: settings.smtp_password || "",
              fromEmail: settings.smtp_from_email || "",
              fromName: settings.smtp_from_name || "Echaly Fashion",
            })

            setEmailNotifications({
              newOrders: settings.notify_new_orders ?? true,
              orderStatusChanges: settings.notify_order_status_changes ?? true,
              lowStock: settings.notify_low_stock ?? true,
              newCustomers: settings.notify_new_customers ?? true,
              returns: settings.notify_returns ?? false,
            })
          }
        } catch (settingsError) {
          console.log("No settings found or error fetching settings, using defaults")
          // This is fine - just means no settings exist yet
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
        setError("Failed to load settings. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminData()
  }, [supabase])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // First authenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: personalInfo.email,
        password: currentPassword,
      })

      if (signInError) {
        throw new Error("Current password is incorrect")
      }

      // Then update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSmtpSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePersonalInfoSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!adminData) {
      toast({
        title: "Error",
        description: "Admin data not loaded. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("admin_users")
        .update({
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          email: personalInfo.email,
        })
        .eq("id", adminData.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSmtpSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!adminData) {
      toast({
        title: "Error",
        description: "Admin data not loaded. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // First check if settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from("admin_settings")
        .select("id")
        .eq("admin_id", adminData.id)
        .maybeSingle()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking settings:", checkError)
        throw new Error("Failed to check existing settings")
      }

      const settingsData = {
        smtp_host: smtpSettings.host,
        smtp_port: smtpSettings.port,
        smtp_username: smtpSettings.username,
        smtp_password: smtpSettings.password,
        smtp_from_email: smtpSettings.fromEmail,
        smtp_from_name: smtpSettings.fromName,
        notify_new_orders: emailNotifications.newOrders,
        notify_order_status_changes: emailNotifications.orderStatusChanges,
        notify_low_stock: emailNotifications.lowStock,
        notify_new_customers: emailNotifications.newCustomers,
        notify_returns: emailNotifications.returns,
        updated_at: new Date().toISOString(),
      }

      if (existingSettings) {
        // Update existing settings
        const { error } = await supabase.from("admin_settings").update(settingsData).eq("id", existingSettings.id)

        if (error) throw error
      } else {
        // Create new settings
        const { error } = await supabase.from("admin_settings").insert([
          {
            admin_id: adminData.id,
            ...settingsData,
          },
        ])

        if (error) throw error
      }

      toast({
        title: "Settings saved",
        description: "Your email settings have been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!adminData) {
      toast({
        title: "Error",
        description: "Admin data not loaded. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // First check if settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from("admin_settings")
        .select("id")
        .eq("admin_id", adminData.id)
        .maybeSingle()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking settings:", checkError)
        throw new Error("Failed to check existing settings")
      }

      const notificationData = {
        notify_new_orders: emailNotifications.newOrders,
        notify_order_status_changes: emailNotifications.orderStatusChanges,
        notify_low_stock: emailNotifications.lowStock,
        notify_new_customers: emailNotifications.newCustomers,
        notify_returns: emailNotifications.returns,
        updated_at: new Date().toISOString(),
      }

      if (existingSettings) {
        // Update existing settings
        const { error } = await supabase.from("admin_settings").update(notificationData).eq("id", existingSettings.id)

        if (error) throw error
      } else {
        // Create new settings with default values for other fields
        const { error } = await supabase.from("admin_settings").insert([
          {
            admin_id: adminData.id,
            smtp_host: "",
            smtp_port: "587",
            smtp_username: "",
            smtp_password: "",
            smtp_from_email: "",
            smtp_from_name: "Echaly Fashion",
            ...notificationData,
          },
        ])

        if (error) throw error
      }

      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error saving notification settings:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />

        <main className="p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-light">Settings</h1>
            <p className="text-gray-600">Manage your account and application settings</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading settings...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500 text-white p-4 rounded-md mb-6">
              <p className="font-medium">Error</p>
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-2 bg-white text-red-500 hover:bg-red-100"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="account">
              <TabsList className="mb-6 w-full overflow-x-auto flex-nowrap">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handlePersonalInfoSave} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={personalInfo.firstName}
                            onChange={handlePersonalInfoChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={personalInfo.lastName}
                            onChange={handlePersonalInfoChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={personalInfo.role} disabled />
                      </div>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="currentPassword"
                              type="password"
                              className="pl-10"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="newPassword"
                              type="password"
                              className="pl-10"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              type="password"
                              className="pl-10"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Settings</CardTitle>
                    <CardDescription>Configure your SMTP settings for sending emails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSmtpSave} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="host">SMTP Host</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="host"
                                name="host"
                                className="pl-10"
                                value={smtpSettings.host}
                                onChange={handleSmtpChange}
                                placeholder="smtp.example.com"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="port">SMTP Port</Label>
                            <Input
                              id="port"
                              name="port"
                              value={smtpSettings.port}
                              onChange={handleSmtpChange}
                              placeholder="587"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">SMTP Username</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="username"
                                name="username"
                                className="pl-10"
                                value={smtpSettings.username}
                                onChange={handleSmtpChange}
                                placeholder="username@example.com"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">SMTP Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                className="pl-10"
                                value={smtpSettings.password}
                                onChange={handleSmtpChange}
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fromEmail">From Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="fromEmail"
                                name="fromEmail"
                                className="pl-10"
                                value={smtpSettings.fromEmail}
                                onChange={handleSmtpChange}
                                placeholder="noreply@echaly.com"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fromName">From Name</Label>
                            <Input
                              id="fromName"
                              name="fromName"
                              value={smtpSettings.fromName}
                              onChange={handleSmtpChange}
                              placeholder="Echaly Fashion"
                            />
                          </div>
                        </div>
                      </div>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Email Settings"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Configure which events trigger email notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleNotificationSave} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="newOrders">New Orders</Label>
                            <p className="text-sm text-gray-500">Receive an email when a new order is placed</p>
                          </div>
                          <Switch
                            id="newOrders"
                            checked={emailNotifications.newOrders}
                            onCheckedChange={() => handleNotificationToggle("newOrders")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="orderStatusChanges">Order Status Changes</Label>
                            <p className="text-sm text-gray-500">Receive an email when an order status changes</p>
                          </div>
                          <Switch
                            id="orderStatusChanges"
                            checked={emailNotifications.orderStatusChanges}
                            onCheckedChange={() => handleNotificationToggle("orderStatusChanges")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="lowStock">Low Stock Alerts</Label>
                            <p className="text-sm text-gray-500">
                              Receive an email when a product is running low on stock
                            </p>
                          </div>
                          <Switch
                            id="lowStock"
                            checked={emailNotifications.lowStock}
                            onCheckedChange={() => handleNotificationToggle("lowStock")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="newCustomers">New Customers</Label>
                            <p className="text-sm text-gray-500">Receive an email when a new customer registers</p>
                          </div>
                          <Switch
                            id="newCustomers"
                            checked={emailNotifications.newCustomers}
                            onCheckedChange={() => handleNotificationToggle("newCustomers")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="returns">Returns and Refunds</Label>
                            <p className="text-sm text-gray-500">
                              Receive an email when a return or refund is requested
                            </p>
                          </div>
                          <Switch
                            id="returns"
                            checked={emailNotifications.returns}
                            onCheckedChange={() => handleNotificationToggle("returns")}
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Notification Settings"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}
