
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function AccountSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("Usuário");
  const [email, setEmail] = useState("usuario@exemplo.com");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
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
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar sua conta.",
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
          <Label htmlFor="username">Nome de usuário</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-zinc-800" />
        </div>
        <Button 
          onClick={handleSaveProfile}
          className="mt-2 bg-cyan-700 hover:bg-cyan-600 text-white transition-all duration-200 hover:scale-[1.02]"
        >
          Salvar alterações
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
