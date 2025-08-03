import { useState } from 'react';
import { Button } from '@/components/ui/button';
// Corrected import statement using curly braces for a named export
import { CreateCompetitionModal } from '@/components/competitions/CreateCompetitionModal';

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Competition</Button>
      </div>
      
      {/* Placeholder for where competitions will be listed */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">My Competitions</h2>
        <div className="mt-4 p-8 text-center border-2 border-dashed rounded-lg text-gray-500 dark:border-gray-700">
          <p>You haven't joined or created any competitions yet.</p>
          <p className="mt-2 text-sm">Click "Create Competition" to get started!</p>
        </div>
      </div>

      <CreateCompetitionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
