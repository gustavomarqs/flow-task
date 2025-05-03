
import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, User, UserCog, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [username, setUsername] = useState("Usuário");
  const [email, setEmail] = useState("usuario@exemplo.com");
  
  // Configurações de aparência
  const [darkMode, setDarkMode] = useState(true);
  
  // Configurações de notificações
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const handleDeleteData = () => {
    // Aqui implementaríamos a lógica para excluir os dados do usuário
    toast({
      title: "Dados excluídos",
      description: "Todos os seus dados foram excluídos permanentemente.",
      variant: "destructive",
    });
  };

  const handleResetData = () => {
    // Aqui implementaríamos a lógica para redefinir os dados do usuário
    toast({
      title: "Dados redefinidos",
      description: "Todos os seus dados foram redefinidos para os valores padrão.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Gerencie suas preferências e dados" />
      
      <Tabs defaultValue="conta" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="conta">
            <User className="mr-2 h-4 w-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="aparencia">
            <Settings className="mr-2 h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <UserCog className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="dados">
            <Trash2 className="mr-2 h-4 w-4" />
            Gerenciamento de Dados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conta">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button onClick={handleSaveProfile}>Salvar alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="aparencia">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Aparência</CardTitle>
              <CardDescription>Personalize a aparência do aplicativo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">Ativar modo escuro para toda a interface</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Gerencie como o aplicativo te notifica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações</p>
                  <p className="text-sm text-muted-foreground">Receba notificações sobre suas tarefas</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Efeitos Sonoros</p>
                  <p className="text-sm text-muted-foreground">Ativar sons para notificações e ações</p>
                </div>
                <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dados">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Dados</CardTitle>
              <CardDescription>Gerencie seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Exportar Dados</h4>
                  <p className="text-sm text-muted-foreground mb-2">Baixe todas as suas tarefas, façanhas e pensamentos</p>
                  <Button variant="outline">Exportar dados</Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Redefinir Dados</h4>
                  <p className="text-sm text-muted-foreground mb-2">Redefina todas as suas configurações para os valores padrão</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Redefinir dados</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Redefinir dados?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá redefinir todas as suas configurações para os valores padrão.
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetData}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-destructive">Excluir Dados</h4>
                  <p className="text-sm text-muted-foreground mb-2">Exclua permanentemente todas as suas tarefas, façanhas e pensamentos</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Excluir todos os dados</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir dados permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá excluir permanentemente todas as suas tarefas, façanhas e pensamentos.
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteData}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
