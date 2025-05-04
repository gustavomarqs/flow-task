
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
import { saveToStorage, getFromStorage, clearStorage, getCategoryColors } from '@/utils/storage';

const defaultCategories = ["Treinos", "Estudos"];

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [username, setUsername] = useState("Usuário");
  const [email, setEmail] = useState("usuario@exemplo.com");
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  
  // Configurações de notificações
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // Carregar categorias e cores do localStorage
  useEffect(() => {
    const savedCategories = getFromStorage<string[]>('categories', defaultCategories);
    setCategories(savedCategories);
    
    // Load category colors
    const colors = getCategoryColors(savedCategories);
    setCategoryColors(colors);
  }, []);

  // Salvar categorias no localStorage quando mudam
  useEffect(() => {
    saveToStorage('categories', categories);
  }, [categories]);

  // Salvar cores das categorias quando mudam
  useEffect(() => {
    saveToStorage('categoryColors', categoryColors);
  }, [categoryColors]);

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
    const defaultColors = getCategoryColors(defaultCategories);
    setCategoryColors(defaultColors);
    saveToStorage('categories', defaultCategories);
    saveToStorage('categoryColors', defaultColors);
    
    toast({
      title: "Dados redefinidos",
      description: "Todos os seus dados foram redefinidos para os valores padrão.",
    });
  };

  const handleAddCategory = (category: string, color: string) => {
    setCategories(prev => [...prev, category]);
    setCategoryColors(prev => ({...prev, [category]: color}));
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    
    // Remove color for this category
    const updatedColors = {...categoryColors};
    delete updatedColors[category];
    setCategoryColors(updatedColors);
    
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

  const handleUpdateCategoryColor = (category: string, color: string) => {
    setCategoryColors(prev => ({...prev, [category]: color}));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Configurações" 
        description="Gerencie suas preferências e dados"
        showAddButton={false} 
      />
      
      <Tabs defaultValue="categorias" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="conta">
            <User className="mr-2 h-4 w-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="categorias">
            <Tag className="mr-2 h-4 w-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="dados">
            <Trash2 className="mr-2 h-4 w-4" />
            Gerenciamento de Dados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conta">
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
        </TabsContent>
        
        <TabsContent value="categorias">
          <Card className="bg-zinc-900/90 rounded-2xl shadow-md">
            <CardHeader className="pb-2 pt-6">
              <CardTitle className="text-xl font-bold text-white/90">Gerenciamento de Categorias</CardTitle>
              <CardDescription>Adicione, edite ou remova categorias para organizar suas tarefas</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <CategoryManager 
                categories={categories}
                categoryColors={categoryColors}
                onAddCategory={handleAddCategory}
                onRemoveCategory={handleRemoveCategory}
                onUpdateCategoryColor={handleUpdateCategoryColor}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dados">
          <Card className="bg-zinc-900/90 rounded-2xl shadow-md">
            <CardHeader className="pb-2 pt-6">
              <CardTitle className="text-xl font-bold text-white/90">Gerenciamento de Dados</CardTitle>
              <CardDescription>Gerencie seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="p-5 bg-zinc-800/50 rounded-lg">
                  <h4 className="font-medium mb-3">Exportar Dados</h4>
                  <p className="text-sm text-muted-foreground mb-4">Baixe todas as suas tarefas, façanhas e pensamentos</p>
                  <Button 
                    variant="outline" 
                    className="w-full bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Exportar dados
                  </Button>
                </div>
                
                <div className="p-5 bg-zinc-800/50 rounded-lg">
                  <h4 className="font-medium mb-3">Redefinir Dados</h4>
                  <p className="text-sm text-muted-foreground mb-4">Redefina todas as suas configurações para os valores padrão</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 hover:scale-[1.02]"
                      >
                        Redefinir dados
                      </Button>
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
                
                <div className="p-5 bg-zinc-800/50 rounded-lg">
                  <h4 className="font-medium mb-3 text-destructive">Excluir Dados</h4>
                  <p className="text-sm text-muted-foreground mb-4">Exclua permanentemente todas as suas tarefas, façanhas e pensamentos</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        className="w-full transition-all duration-200 hover:scale-[1.02]"
                      >
                        Excluir todos os dados
                      </Button>
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
