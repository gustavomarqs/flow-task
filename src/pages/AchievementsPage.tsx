
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { AchievementCard } from '@/components/AchievementCard';
import { AchievementForm } from '@/components/AchievementForm';
import { Input } from '@/components/ui/input';
import { Achievement } from '@/types/achievement';
import { getCurrentDateTime } from '@/utils/date-time';
import { useAuth } from '@/auth/AuthProvider';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    // Load achievements from localStorage with user-specific key
    if (user) {
      const savedAchievements = localStorage.getItem(`achievements_${user.id}`);
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    }
  }, [user?.id]);

  useEffect(() => {
    // Save achievements to localStorage with user-specific key
    if (user) {
      localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
    }
  }, [achievements, user?.id]);

  const handleAddAchievement = () => {
    setEditingAchievement(null);
    setIsFormOpen(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsFormOpen(true);
  };

  const handleSaveAchievement = (achievement: Achievement) => {
    // Ensure created timestamp is set with proper timezone
    const achievementWithTimestamp = {
      ...achievement,
      createdAt: achievement.createdAt || getCurrentDateTime()
    };
    
    if (editingAchievement) {
      setAchievements(achievements.map(a => a.id === achievement.id ? achievementWithTimestamp : a));
    } else {
      setAchievements([...achievements, achievementWithTimestamp]);
    }
    setIsFormOpen(false);
    setEditingAchievement(null);
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(achievements.filter(achievement => achievement.id !== id));
  };

  // Filter and sort achievements
  const filteredAchievements = achievements
    .filter(achievement => {
      return (
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Minhas Façanhas"
        action={handleAddAchievement}
        actionLabel="Nova Façanha"
      />
      
      <div className="mb-6">
        <Input
          placeholder="Pesquisar façanhas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-medium-gray"
        />
      </div>
      
      {filteredAchievements.length > 0 ? (
        <div>
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onEdit={handleEditAchievement}
              onDelete={handleDeleteAchievement}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">
            {searchQuery 
              ? "Nenhuma façanha encontrada para sua pesquisa." 
              : "Nenhuma façanha registrada ainda. Comece registrando uma nova conquista!"}
          </p>
        </div>
      )}
      
      <AchievementForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAchievement}
        editAchievement={editingAchievement}
      />
    </div>
  );
}
