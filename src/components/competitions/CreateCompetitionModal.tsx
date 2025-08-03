import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Mock function until we build the real one
// import { createCompetition } from '@/api/competitions';

interface CreateCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCompetitionModal: React.FC<CreateCompetitionModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [startingCapital, setStartingCapital] = useState('100000');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const capital = parseInt(startingCapital);
    if (!name || isNaN(capital) || capital <= 0) {
      alert('Please enter a valid name and starting capital.');
      return;
    }
    
    try {
      // await createCompetition({ name, startingCapital: capital });
      console.log(`Creating competition: ${name} with $${capital}`);
      alert('Competition created successfully!'); // Replace with a better notification
      onClose();
    } catch (error) {
      console.error('Failed to create competition:', error);
      alert('Failed to create competition.'); // Replace with a better notification
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create New Competition</h2>
        
        <div className="mb-4">
          <label htmlFor="comp-name" className="block text-sm font-medium text-muted-foreground mb-2">Competition Name</label>
          <Input 
            id="comp-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Q4 Trading Challenge"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="capital" className="block text-sm font-medium text-muted-foreground mb-2">Starting Capital</label>
          <Input 
            id="capital"
            type="number"
            value={startingCapital}
            onChange={(e) => setStartingCapital(e.target.value)}
            placeholder="e.g., 100000"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompetitionModal;
