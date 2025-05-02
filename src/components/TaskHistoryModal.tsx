
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface TaskHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: RecurringTask | null;
  entries: RecurringTaskEntry[];
}

export function TaskHistoryModal({ 
  isOpen, 
  onClose, 
  task,
  entries
}: TaskHistoryModalProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'missed'>('all');
  
  if (!task) return null;
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Apply filter
  const filteredEntries = sortedEntries.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'completed') return entry.completed;
    if (filter === 'missed') return !entry.completed;
    return true;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-dark-gray border border-neon/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-gradient-text">
            Histórico: {task.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-sm text-sm ${filter === 'all' ? 'bg-neon text-deep-dark' : 'bg-medium-gray'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-sm text-sm ${filter === 'completed' ? 'bg-neon text-deep-dark' : 'bg-medium-gray'}`}
          >
            Concluídos
          </button>
          <button 
            onClick={() => setFilter('missed')}
            className={`px-3 py-1 rounded-sm text-sm ${filter === 'missed' ? 'bg-neon text-deep-dark' : 'bg-medium-gray'}`}
          >
            Não Concluídos
          </button>
        </div>
        
        {filteredEntries.length > 0 ? (
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-dark-gray">
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map(entry => (
                  <TableRow key={entry.id} className={entry.completed ? "" : "opacity-60"}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-sm text-xs ${entry.completed ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>
                        {entry.completed ? "Concluído" : "Não concluído"}
                      </span>
                    </TableCell>
                    <TableCell>{entry.details || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Nenhum registro encontrado para o filtro selecionado.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
