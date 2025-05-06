
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  
  // Redireccionar se o usuário já estiver autenticado
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location.state]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos em branco",
        description: "Por favor, preencha o email e senha.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Login bem-sucedido",
        description: "Você foi conectado com sucesso!"
      });
      
    } catch (error: any) {
      toast({
        title: "Erro de login",
        description: error.message || "Falha ao realizar login. Verifique suas credenciais.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu email.",
        variant: "destructive"
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, defina uma senha.",
        variant: "destructive"
      });
      return;
    }
    
    if (!fullName) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso! Você já pode fazer login."
      });
      
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu email para recuperar a senha.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password',
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast({
        title: "Email enviado",
        description: "Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada."
      });
      
    } catch (error: any) {
      toast({
        title: "Erro na recuperação",
        description: error.message || "Não foi possível enviar o email de recuperação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black/90 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold neon-gradient-text">FlowTask</h1>
          <p className="text-gray-400 mt-2">Gerencie suas tarefas com eficiência</p>
        </div>
        
        {showResetPassword ? (
          <Card className="border-cyan-800/30 bg-zinc-900/90">
            <CardHeader>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mr-2 p-0 h-8 w-8"
                  onClick={() => setShowResetPassword(false)}
                >
                  <ArrowLeft size={18} />
                </Button>
                <CardTitle>Recuperar Senha</CardTitle>
              </div>
              <CardDescription>
                Digite seu email para receber um link de recuperação
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                {resetSent && (
                  <Alert className="bg-green-900/20 border-green-500/30 text-green-200">
                    <AlertDescription>
                      Email enviado! Verifique sua caixa de entrada para redefinir sua senha.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email-reset">Email</Label>
                  <Input 
                    id="email-reset"
                    type="email" 
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800"
                    disabled={isLoading || resetSent}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-cyan-700 hover:bg-cyan-600 transition-all duration-200"
                  disabled={isLoading || resetSent}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Enviando...
                    </>
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-cyan-800/30 bg-zinc-900/90">
                <CardHeader>
                  <CardTitle>Entrar</CardTitle>
                  <CardDescription>
                    Entre com suas credenciais para acessar sua conta
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <Input 
                        id="email-login"
                        type="email" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-800"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-login">Senha</Label>
                      <Input 
                        id="password-login" 
                        type="password"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-zinc-800"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="text-right">
                      <Button 
                        type="button" 
                        variant="link" 
                        className="p-0 h-auto text-cyan-400 hover:text-cyan-300"
                        onClick={() => setShowResetPassword(true)}
                      >
                        Esqueceu sua senha?
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-cyan-700 hover:bg-cyan-600 transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Entrando...
                        </>
                      ) : (
                        'Entrar'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="cadastro">
              <Card className="border-cyan-800/30 bg-zinc-900/90">
                <CardHeader>
                  <CardTitle>Criar conta</CardTitle>
                  <CardDescription>
                    Crie uma nova conta para começar a usar o FlowTask
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName-signup">Nome completo</Label>
                      <Input 
                        id="fullName-signup"
                        type="text" 
                        placeholder="Seu nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-zinc-800"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input 
                        id="email-signup"
                        type="email" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-800"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Senha</Label>
                      <Input 
                        id="password-signup" 
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-zinc-800"
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-cyan-700 hover:bg-cyan-600 transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Criando conta...
                        </>
                      ) : (
                        'Criar conta'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
