import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CreateCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCompetitionModal = ({
  isOpen,
  onClose,
}: CreateCompetitionModalProps) => {
  const [competitionName, setCompetitionName] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to save to Firestore will go here
    console.log("Creating competition:", competitionName);
    onClose(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Competition</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="competitionName" className="block text-sm font-medium text-gray-700">
                Competition Name
              </label>
              <input
                type="text"
                id="competitionName"
                name="competitionName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
              />
            </div>
            {/* We will add more fields like dates and starting cash here later */}
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompetitionModal;
