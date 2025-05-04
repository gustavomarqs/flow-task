
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, User, UserCog, Settings, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CategoryManager } from '@/components/CategoryManager';
import { saveToStorage, getFromStorage, clearStorage } from '@/utils/storage';

const defaultCategories = ["Treinos", "Estudos"];

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [username, setUsername] = useState("Usuário");
  const [email, setEmail] = useState("usuario@exemplo.com");
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  
  // Configurações de notificações
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // Carregar categorias do localStorage
  useEffect(() => {
    const savedCategories = getFromStorage<string[]>('categories', defaultCategories);
    setCategories(savedCategories);
  }, []);

  // Salvar categorias no localStorage quando mudam
  useEffect(() => {
    saveToStorage('categories', categories);
  }, [categories]);

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const handleDeleteData = () => {
    clearStorage();
    toast({
      title: "Dados excluídos",
      description: "Todos os seus dados foram excluídos permanentemente.",
      variant: "destructive",
    });
    // Recarregar a página para refletir as mudanças
    window.location.reload();
  };

  const handleResetData = () => {
    setCategories(defaultCategories);
    saveToStorage('categories', defaultCategories);
    toast({
      title: "Dados redefinidos",
      description: "Todos os seus dados foram redefinidos para os valores padrão.",
    });
  };

  const handleAddCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    
    // Atualizar tarefas associadas a esta categoria
    const savedTasks = getFromStorage('tasks', []);
    const updatedTasks = savedTasks.map((task: any) => {
      if (task.category === category) {
        return { ...task, category: "Geral" };
      }
      return task;
    });
    saveToStorage('tasks', updatedTasks);
    
    // Atualizar tarefas recorrentes associadas a esta categoria
    const savedRecurringTasks = getFromStorage('recurringTasks', []);
    const updatedRecurringTasks = savedRecurringTasks.map((task: any) => {
      if (task.category === category) {
        return { ...task, category: "Geral" };
      }
      return task;
    });
    saveToStorage('recurringTasks', updatedRecurringTasks);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações" 
        description="Gerencie suas preferências e dados"
        showAddButton={false} 
      />
      
      <Tabs defaultValue="conta" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="conta">
            <User className="mr-2 h-4 w-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="categorias">
            <Tag className="mr-2 h-4 w-4" />
            Categorias
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
        
        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Categorias</CardTitle>
              <CardDescription>Adicione, edite ou remova categorias para organizar suas tarefas</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManager 
                categories={categories}
                onAddCategory={handleAddCategory}
                onRemoveCategory={handleRemoveCategory}
              />
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
