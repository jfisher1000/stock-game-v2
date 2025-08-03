import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/config/firebase"; // Import your Firebase app instance

interface CreateCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initialize Firebase Functions and get a reference to the callable function
const functions = getFunctions(app);
const createCompetitionCallable = httpsCallable(functions, 'createCompetition');

export function CreateCompetitionModal({ isOpen, onClose }: CreateCompetitionModalProps) {
  const [competitionName, setCompetitionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    // Basic client-side validation
    if (!competitionName.trim()) {
      setError("Competition name cannot be empty.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Call the cloud function with the competition name
      const result = await createCompetitionCallable({ name: competitionName });
      
      console.log("Cloud function executed successfully:", result.data);
      
      // On success, close the modal and reset its state
      onClose();
      setCompetitionName("");

    } catch (err: any) {
      console.error("Error calling createCompetition function:", err);
      // Display the error message from the function to the user
      setError(err.message || "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing the modal
    onClose();
    setCompetitionName("");
    setError(null);
    setIsLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New Competition</h2>
        <div className="space-y-4">
          <Input
            placeholder="e.g., Q4 Trading Challenge"
            value={competitionName}
            onChange={(e) => setCompetitionName(e.target.value)}
            disabled={isLoading}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Competition"}
          </Button>
        </div>
      </div>
    </div>
  );
}
