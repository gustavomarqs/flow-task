
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário tem um token de redefinição válido
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      // Se não tem sessão válida com token de redefinição, redireciona para login
      if (error || !data.session) {
        navigate('/login', { replace: true });
        toast({
          title: "Link inválido",
          description: "O link de redefinição é inválido ou expirou.",
          variant: "destructive"
        });
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A confirmação de senha não corresponde à senha digitada.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi redefinida com sucesso!"
      });
      
      // Redirecionar após alguns segundos
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      
    } catch (error: any) {
      toast({
        title: "Erro na redefinição",
        description: error.message || "Não foi possível redefinir sua senha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/90 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold neon-gradient-text">FlowTask</h1>
          <p className="text-gray-400 mt-2">Redefinição de senha</p>
        </div>
        
        <Card className="border-cyan-800/30 bg-zinc-900/90">
          <CardHeader>
            <CardTitle>Criar nova senha</CardTitle>
            <CardDescription>
              Digite e confirme sua nova senha
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {success && (
                <Alert className="bg-green-900/20 border-green-500/30 text-green-200">
                  <AlertDescription>
                    Senha atualizada com sucesso! Redirecionando para o login...
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800"
                  disabled={isLoading || success}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirme a senha</Label>
                <Input 
                  id="confirm-password"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-zinc-800"
                  disabled={isLoading || success}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-cyan-700 hover:bg-cyan-600 transition-all duration-200"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Redefinindo...
                  </>
                ) : (
                  'Redefinir senha'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
