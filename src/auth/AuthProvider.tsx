
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type UserProfile = {
  id: string;
  email: string;
  fullName?: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to refresh user profile data
  const refreshProfile = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (currentSession?.user) {
      const userData = currentSession.user.user_metadata;
      
      setProfile({
        id: currentSession.user.id,
        email: currentSession.user.email || '',
        fullName: userData?.full_name || ''
      });
    }
  };

  useEffect(() => {
    // Configurar o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Se temos um usuário, extrair informações do perfil dos metadados
        if (currentSession?.user) {
          const userData = currentSession.user.user_metadata;
          
          setProfile({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            fullName: userData?.full_name || ''
          });
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar a sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Se temos um usuário, extrair informações do perfil dos metadados
      if (currentSession?.user) {
        const userData = currentSession.user.user_metadata;
        
        setProfile({
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          fullName: userData?.full_name || ''
        });
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
