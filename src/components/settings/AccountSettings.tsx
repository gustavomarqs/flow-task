
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from "@/auth/AuthProvider";

export function AccountSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
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
        <CardTitle className="text-xl font-bold text-white/90">Informações da Conta</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
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
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            disabled 
            className="bg-zinc-800 opacity-70" 
          />
          <p className="text-xs text-gray-400">O email não pode ser alterado.</p>
        </div>
        <Button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="mt-2 bg-cyan-700 hover:bg-cyan-600 text-white transition-all duration-200 hover:scale-[1.02]"
        >
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </Button>
        
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
