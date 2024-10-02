import { useEffect, useState } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
interface Breed {
  id: string;
  name: string;
  temperament: string;
  origin: string;
  life_span: string;
}

interface Animal {
  id: string;
  url: string;
  breeds?: Breed[];
  height?: any;
}

export const DetailsPage = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let response;
        if (type === "cat") {
          response = await fetch(`https://api.thecatapi.com/v1/images/${id}`, {
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                "live_ltADtKKh5vJzldo90w5OAKDprGQs6cUdkJ8XR3iNiVQ9ZZjvU24dZpY3NJoxVIl6",
            },
          });
        } else if (type === "dog") {
          response = await fetch(`https://api.thedogapi.com/v1/images/${id}`, {
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                "live_Q9eV6vNMTPMPBR6inMrgPXqeIUHJyIU0AJlK8l8prRYGLa8TgfFqOaaALhpNH76u",
            },
          });
        }

        const data = await response.json();
        console.log("item", data);
        setAnimal(data); // Set the fetched animal data
      } catch (error) {
        setError("Error fetching animal details");
        console.log("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, [id, type]); // Re-run effect when id or type changes

  if (error) {
    return <div>{error}</div>;
  }

  if (!animal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Back
      </button>
      <div className="flex flex-col items-center">
        <img
          src={animal.url}
          alt="Animal"
          className="w-full h-[400px] object-cover mb-4"
        />
        <div className="bg-gray-100 p-4 shadow-md rounded">
          {animal.breeds && animal.breeds.length > 0 ? (
            <>
              <h3 className="text-xl font-bold">{animal.breeds[0].name}</h3>
              <p>Temperament: {animal.breeds[0].temperament}</p>
              <p>Origin: {animal.breeds[0].origin}</p>
              <p>Life span: {animal.breeds[0].life_span} years</p>
              <p>Height: {animal.height}</p>
            </>
          ) : (
            <p>No breed information available</p>
          )}
        </div>
      </div>
    </div>
  );
};
