
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Lock } from 'lucide-react';
import { useAuth } from "@/auth/AuthProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AccountSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  
  // Profile Info states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Email change states
  const [newEmail, setNewEmail] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setNewEmail(user.email || "");
    }
    if (profile) {
      setFullName(profile.fullName || "");
    }
  }, [user, profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (updateError) throw updateError;
      
      // Refresh the profile to get updated data
      await refreshProfile();
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error?.message || "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!user) return;
    setEmailError("");
    setEmailSuccess("");
    
    // Simple email validation
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailError("Por favor, informe um email válido");
      return;
    }
    
    setIsChangingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        email: newEmail 
      });
      
      if (error) throw error;
      
      setEmailSuccess("Um email de confirmação foi enviado para o novo endereço. Por favor, verifique sua caixa de entrada.");
      
      // Update local state
      setEmail(newEmail);
      
      toast({
        title: "Solicitação enviada",
        description: "Verifique seu email para confirmar a alteração.",
      });
    } catch (error: any) {
      setEmailError(error?.message || "Ocorreu um erro ao atualizar seu email");
      toast({
        title: "Erro ao atualizar email",
        description: error?.message || "Ocorreu um erro ao tentar atualizar seu email.",
        variant: "destructive"
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    setPasswordError("");
    setPasswordSuccess("");
    
    // Password validation
    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não conferem");
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      setPasswordSuccess("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
    } catch (error: any) {
      setPasswordError(error?.message || "Ocorreu um erro ao atualizar sua senha");
      toast({
        title: "Erro ao atualizar senha",
        description: error?.message || "Ocorreu um erro ao tentar atualizar sua senha.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error?.message || "Ocorreu um erro ao tentar desconectar sua conta.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Card className="bg-zinc-900/90 rounded-2xl shadow-md">
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="text-xl font-bold text-white/90">Minha Conta</CardTitle>
        <CardDescription>Gerencie suas informações pessoais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4" />
              Senha
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="bg-zinc-800" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentEmail">Email atual</Label>
              <Input 
                id="currentEmail" 
                type="email" 
                value={email} 
                disabled 
                className="bg-zinc-800 opacity-70" 
              />
              <p className="text-xs text-gray-400">Para alterar o email, use a aba Email.</p>
            </div>
            <Button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="mt-4 bg-cyan-700 hover:bg-cyan-600 text-white transition-all duration-200 hover:scale-[1.02]"
            >
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </TabsContent>
          
          {/* Email Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentEmailDisplay">Email atual</Label>
              <Input 
                id="currentEmailDisplay" 
                value={email} 
                disabled 
                className="bg-zinc-800 opacity-70" 
              />
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Label htmlFor="newEmail">Novo email</Label>
              <Input 
                id="newEmail" 
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                className="bg-zinc-800" 
              />
              <p className="text-xs text-gray-400">
                Você precisará confirmar a alteração no novo email.
              </p>
            </div>
            
            {emailError && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-200">
                <AlertDescription>{emailError}</AlertDescription>
              </Alert>
            )}
            
            {emailSuccess && (
              <Alert className="bg-green-900/20 border-green-900 text-green-200">
                <AlertDescription>{emailSuccess}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleChangeEmail}
              disabled={isChangingEmail || !newEmail || newEmail === email}
              className="mt-4 bg-cyan-700 hover:bg-cyan-600 text-white transition-all duration-200 hover:scale-[1.02]"
            >
              {isChangingEmail ? "Atualizando..." : "Atualizar email"}
            </Button>
          </TabsContent>
          
          {/* Password Tab */}
          <TabsContent value="password" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="bg-zinc-800" 
                placeholder="Digite sua nova senha" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="bg-zinc-800" 
                placeholder="Confirme sua nova senha" 
              />
            </div>
            
            {passwordError && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-200">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert className="bg-green-900/20 border-green-900 text-green-200">
                <AlertDescription>{passwordSuccess}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleChangePassword}
              disabled={isChangingPassword || !newPassword || !confirmPassword}
              className="mt-4 bg-cyan-700 hover:bg-cyan-600 text-white transition-all duration-200 hover:scale-[1.02]"
            >
              {isChangingPassword ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="pt-6 border-t border-gray-700 mt-6">
          <Button 
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full transition-all duration-200 hover:scale-[1.02]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "Saindo..." : "Sair da conta"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
