
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-end mb-4">
            <SidebarTrigger />
          </div>
          <main className="max-w-5xl mx-auto">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
