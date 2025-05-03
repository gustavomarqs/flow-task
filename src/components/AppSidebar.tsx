
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ListTodo, Trophy, BrainCircuit, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    { name: 'Tarefas', href: '/', icon: ListTodo },
    { name: 'Façanhas', href: '/facanhas', icon: Trophy },
    { name: 'Pensamentos', href: '/pensamentos', icon: BrainCircuit },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold neon-gradient-text">FlowTask</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={currentPath === item.href ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                currentPath === item.href ? "bg-sidebar-accent text-neon" : ""
              } hover:bg-sidebar-accent hover:text-neon transition-all duration-200`}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="w-full border-neon text-neon hover:bg-neon/10 hover:text-neon hover:shadow-[0_0_8px_rgba(10,255,242,0.5)] transition-all duration-200"
            onClick={() => navigate('/configuracoes')}
          >
            <Settings className="mr-2 h-4 w-4" /> Configurações
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
