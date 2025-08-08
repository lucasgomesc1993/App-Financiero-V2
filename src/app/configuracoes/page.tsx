"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe,
  CreditCard,
  DollarSign,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react"

interface UserSettings {
  name: string
  email: string
  phone: string
  currency: string
  language: string
  dateFormat: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  budgetAlerts: boolean
  goalReminders: boolean
  billReminders: boolean
  weeklyReports: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  loginAlerts: boolean
  sessionTimeout: number
  dataEncryption: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto'
  colorScheme: string
  compactMode: boolean
  showCharts: boolean
}

export default function ConfiguracoesPage() {
  // User settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+55 11 98765-4321',
    currency: 'BRL',
    language: 'pt-BR',
    dateFormat: 'DD/MM/YYYY'
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    goalReminders: true,
    billReminders: true,
    weeklyReports: false
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    dataEncryption: true
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'light',
    colorScheme: 'blue',
    compactMode: false,
    showCharts: true
  })

  const handleUserSettingsSave = () => {
    toast.success("Configurações de usuário salvas com sucesso!")
  }

  const handleNotificationSettingsSave = () => {
    toast.success("Configurações de notificações salvas com sucesso!")
  }

  const handleSecuritySettingsSave = () => {
    toast.success("Configurações de segurança salvas com sucesso!")
  }

  const handleAppearanceSettingsSave = () => {
    toast.success("Configurações de aparência salvas com sucesso!")
  }

  const handleExportData = () => {
    toast.success("Dados exportados com sucesso!")
  }

  const handleImportData = () => {
    toast.success("Dados importados com sucesso!")
  }

  const handleDeleteAccount = () => {
    toast.error("Esta ação requer confirmação adicional por segurança.")
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground">
                      Gerencie suas preferências e configurações do sistema
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">Geral</TabsTrigger>
                    <TabsTrigger value="notifications">Notificações</TabsTrigger>
                    <TabsTrigger value="security">Segurança</TabsTrigger>
                    <TabsTrigger value="appearance">Aparência</TabsTrigger>
                    <TabsTrigger value="data">Dados</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Informações Pessoais
                        </CardTitle>
                        <CardDescription>
                          Atualize suas informações pessoais e preferências básicas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="*:not-first:mt-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                              id="name"
                              value={userSettings.name}
                              onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                            />
                          </div>
                          <div className="*:not-first:mt-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                              id="email"
                              type="email"
                              value={userSettings.email}
                              onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="*:not-first:mt-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={userSettings.phone}
                            onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                          />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="*:not-first:mt-2">
                            <Label htmlFor="currency">Moeda Padrão</Label>
                            <Select value={userSettings.currency} onValueChange={(value) => setUserSettings({...userSettings, currency: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BRL">Real (BRL)</SelectItem>
                                <SelectItem value="USD">Dólar (USD)</SelectItem>
                                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="*:not-first:mt-2">
                            <Label htmlFor="language">Idioma</Label>
                            <Select value={userSettings.language} onValueChange={(value) => setUserSettings({...userSettings, language: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                                <SelectItem value="en-US">English (US)</SelectItem>
                                <SelectItem value="es-ES">Español</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="*:not-first:mt-2">
                            <Label htmlFor="dateFormat">Formato de Data</Label>
                            <Select value={userSettings.dateFormat} onValueChange={(value) => setUserSettings({...userSettings, dateFormat: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={handleUserSettingsSave}>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          Preferências de Notificação
                        </CardTitle>
                        <CardDescription>
                          Configure como e quando você deseja receber notificações
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="emailNotifications">Notificações por E-mail</Label>
                              <p className="text-sm text-muted-foreground">
                                Receba atualizações importantes no seu e-mail
                              </p>
                            </div>
                            <Switch
                              id="emailNotifications"
                              checked={notificationSettings.emailNotifications}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({...notificationSettings, emailNotifications: checked})
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="pushNotifications">Notificações Push</Label>
                              <p className="text-sm text-muted-foreground">
                                Receba notificações em tempo real no seu dispositivo
                              </p>
                            </div>
                            <Switch
                              id="pushNotifications"
                              checked={notificationSettings.pushNotifications}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({...notificationSettings, pushNotifications: checked})
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="budgetAlerts">Alertas de Orçamento</Label>
                              <p className="text-sm text-muted-foreground">
                                Seja notificado quando atingir limites de orçamento
                              </p>
                            </div>
                            <Switch
                              id="budgetAlerts"
                              checked={notificationSettings.budgetAlerts}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({...notificationSettings, budgetAlerts: checked})
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="goalReminders">Lembretes de Metas</Label>
                              <p className="text-sm text-muted-foreground">
                                Receba lembretes sobre o progresso das suas metas
                              </p>
                            </div>
                            <Switch
                              id="goalReminders"
                              checked={notificationSettings.goalReminders}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({...notificationSettings, goalReminders: checked})
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="billReminders">Lembretes de Contas</Label>
                              <p className="text-sm text-muted-foreground">
                                Seja lembrado sobre vencimentos de contas
                              </p>
                            </div>
                            <Switch
                              id="billReminders"
                              checked={notificationSettings.billReminders}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({...notificationSettings, billReminders: checked})
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="weeklyReports">Relatórios Semanais</Label>
                              <p className="text-sm text-muted-foreground">
                                Receba um resumo semanal das suas finanças
                              </p>
                            </div>
                            <Switch
                              id="weeklyReports"
                              checked={notificationSettings.weeklyReports}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({...notificationSettings, weeklyReports: checked})
                              }
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={handleNotificationSettingsSave}>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Configurações de Segurança
                        </CardTitle>
                        <CardDescription>
                          Gerencie as configurações de segurança da sua conta
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="twoFactorAuth">Autenticação de Dois Fatores</Label>
                              <p className="text-sm text-muted-foreground">
                                Adicione uma camada extra de segurança à sua conta
                              </p>
                            </div>
                            <Switch
                              id="twoFactorAuth"
                              checked={securitySettings.twoFactorAuth}
                              onCheckedChange={(checked) => 
                                setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="loginAlerts">Alertas de Login</Label>
                              <p className="text-sm text-muted-foreground">
                                Receba notificações sobre novos logins na sua conta
                              </p>
                            </div>
                            <Switch
                              id="loginAlerts"
                              checked={securitySettings.loginAlerts}
                              onCheckedChange={(checked) => 
                                setSecuritySettings({...securitySettings, loginAlerts: checked})
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="dataEncryption">Criptografia de Dados</Label>
                              <p className="text-sm text-muted-foreground">
                                Mantenha seus dados criptografados para maior segurança
                              </p>
                            </div>
                            <Switch
                              id="dataEncryption"
                              checked={securitySettings.dataEncryption}
                              onCheckedChange={(checked) => 
                                setSecuritySettings({...securitySettings, dataEncryption: checked})
                              }
                            />
                          </div>

                          <div className="*:not-first:mt-2">
                            <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                            <Select 
                              value={securitySettings.sessionTimeout.toString()} 
                              onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(value)})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 minutos</SelectItem>
                                <SelectItem value="30">30 minutos</SelectItem>
                                <SelectItem value="60">1 hora</SelectItem>
                                <SelectItem value="120">2 horas</SelectItem>
                                <SelectItem value="240">4 horas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Ações de Segurança</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Alterar Senha
                            </Button>
                            <Button variant="outline" className="w-full">
                              <Shield className="mr-2 h-4 w-4" />
                              Verificar Dispositivos
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={handleSecuritySettingsSave}>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          Aparência e Interface
                        </CardTitle>
                        <CardDescription>
                          Personalize a aparência do aplicativo
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="*:not-first:mt-2">
                            <Label htmlFor="theme">Tema</Label>
                            <Select value={appearanceSettings.theme} onValueChange={(value: any) => setAppearanceSettings({...appearanceSettings, theme: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Claro</SelectItem>
                                <SelectItem value="dark">Escuro</SelectItem>
                                <SelectItem value="auto">Automático</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="*:not-first:mt-2">
                            <Label htmlFor="colorScheme">Esquema de Cores</Label>
                            <Select value={appearanceSettings.colorScheme} onValueChange={(value) => setAppearanceSettings({...appearanceSettings, colorScheme: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blue">Azul</SelectItem>
                                <SelectItem value="green">Verde</SelectItem>
                                <SelectItem value="purple">Roxo</SelectItem>
                                <SelectItem value="orange">Laranja</SelectItem>
                                <SelectItem value="red">Vermelho</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="compactMode">Modo Compacto</Label>
                              <p className="text-sm text-muted-foreground">
                                Exiba mais conteúdo em menos espaço
                              </p>
                            </div>
                            <Switch
                              id="compactMode"
                              checked={appearanceSettings.compactMode}
                              onCheckedChange={(checked) => 
                                setAppearanceSettings({...appearanceSettings, compactMode: checked})
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="showCharts">Mostrar Gráficos</Label>
                              <p className="text-sm text-muted-foreground">
                                Exiba gráficos visuais nas páginas principais
                              </p>
                            </div>
                            <Switch
                              id="showCharts"
                              checked={appearanceSettings.showCharts}
                              onCheckedChange={(checked) => 
                                setAppearanceSettings({...appearanceSettings, showCharts: checked})
                              }
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={handleAppearanceSettingsSave}>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="data" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          Gerenciamento de Dados
                        </CardTitle>
                        <CardDescription>
                          Gerencie seus dados e configurações de armazenamento
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Backup e Exportação</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline" onClick={handleExportData} className="w-full">
                              <Download className="mr-2 h-4 w-4" />
                              Exportar Dados
                            </Button>
                            <Button variant="outline" onClick={handleImportData} className="w-full">
                              <Upload className="mr-2 h-4 w-4" />
                              Importar Dados
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Limpeza de Dados</h4>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Limpar Cache
                            </Button>
                            <Button variant="outline" className="w-full">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover Dados Temporários
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-red-600">Zona de Perigo</h4>
                          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                            <div className="space-y-2">
                              <p className="text-sm text-red-800">
                                Estas ações são permanentes e não podem ser desfeitas.
                              </p>
                              <Button 
                                variant="destructive" 
                                onClick={handleDeleteAccount}
                                className="w-full"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir Conta e Todos os Dados
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <p>Versão do aplicativo: 1.0.0</p>
                          <p>Última atualização: 15 de julho de 2024</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }