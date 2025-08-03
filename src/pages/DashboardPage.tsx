// src/pages/DashboardPage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateCompetitionModal from '@/components/competitions/CreateCompetitionModal';
import { useQuery } from '@tanstack/react-query';
import { fetchUserCompetitions, Competition } from '@/api/competitions';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use TanStack Query to fetch the user's competitions.
  // The 'queryKey' is used for caching. TanStack Query will refetch
  // this data automatically based on the staleTime/gcTime we set in main.tsx.
  // The 'queryFn' is the async function that fetches the data.
  const { 
    data: competitions, 
    isLoading, 
    isError,
    error 
  } = useQuery<Competition[], Error>({
    queryKey: ['competitions'], 
    queryFn: fetchUserCompetitions
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleOpenModal}>Create New Competition</Button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Competitions</h2>
        
        {/* Display a loading state */}
        {isLoading && <p className="text-muted-foreground">Loading competitions...</p>}

        {/* Display an error message if the fetch fails */}
        {isError && <p className="text-destructive">Error: {error.message}</p>}

        {/* Display the list of competitions or a message if there are none */}
        {competitions && (
          competitions.length > 0 ? (
            <ul className="space-y-4">
              {competitions.map((comp) => (
                <li key={comp.id} className="border p-4 rounded-md hover:bg-muted transition-colors">
                  <Link to={`/competition/${comp.id}`} className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-medium">{comp.name}</h3>
                      <p className="text-sm text-muted-foreground">Starting Capital: ${comp.startingCapital.toLocaleString()}</p>
                    </div>
                    <span className="text-primary">&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">You haven't joined or created any competitions yet.</p>
          )
        )}
      </div>

      <CreateCompetitionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default DashboardPage;
