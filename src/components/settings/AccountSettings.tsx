
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function AccountSettings() {
  const { toast } = useToast();
  const [username, setUsername] = useState("Usuário");
  const [email, setEmail] = useState("usuario@exemplo.com");

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
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
      </CardContent>
    </Card>
  );
}
