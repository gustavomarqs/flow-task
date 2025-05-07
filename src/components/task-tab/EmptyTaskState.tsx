
import React from 'react';

export function EmptyTaskState() {
  return (
    <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
      <p className="text-gray-400">
        Nenhuma tarefa encontrada. Comece adicionando uma nova tarefa!
      </p>
    </div>
  );
}
