
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { clearStorage } from '@/utils/storage';

export function DataManagement() {
  const { toast } = useToast();

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
    // The reset functionality is handled in ConfiguracoesPage as it requires access to categories state
    toast({
      title: "Dados redefinidos",
      description: "Todos os seus dados foram redefinidos para os valores padrão.",
    });
  };

  return (
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
  );
}
