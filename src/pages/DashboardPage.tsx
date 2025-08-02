import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateCompetitionModal from "@/components/competitions/CreateCompetitionModal";

const DashboardPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          Create Competition
        </Button>
      </div>

      {/* This is where the list of competitions will go later */}
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <h2 className="text-xl font-semibold">No Competitions Yet</h2>
        <p className="text-gray-500 mt-2">
          Create a new competition to get started!
        p>
      </div>

      {/* The modal for creating a new competition */}
      <CreateCompetitionModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
