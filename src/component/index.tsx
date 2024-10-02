import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";

import { Spinner } from "flowbite-react";

interface Breed {
  id: string;
  name: string;
  temperament: string;
}

interface Animal {
  id: string;
  url: string;
  type: string;
  breeds?: Breed[];
}
export const IndexPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [animalFilter, setAnimalFilter] = useState<string>("all");
  const [breedFilter, setBreedFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const catResp = await fetch(
          "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=100",
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                "live_ltADtKKh5vJzldo90w5OAKDprGQs6cUdkJ8XR3iNiVQ9ZZjvU24dZpY3NJoxVIl6",
            },
          }
        );
        const dogResp = await fetch(
          "https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=100",
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                "live_Q9eV6vNMTPMPBR6inMrgPXqeIUHJyIU0AJlK8l8prRYGLa8TgfFqOaaALhpNH76u",
            },
          }
        );
        if (!catResp.ok || !dogResp.ok) {
          throw new Error("Failed to fetch animal data");
        }

        const catData = await catResp.json();
        const dogData = await dogResp.json();
        const combinedData = [
          ...catData.map((cat) => ({ ...cat, type: "cat" })),
          ...dogData.map((dog) => ({ ...dog, type: "dog" })),
        ];
        setAnimals(combinedData);
        console.log("data", catData);
        setFilteredAnimals(combinedData);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let searchResult = animals;
    if (searchQuery) {
      searchResult = animals.filter((animal) => {
        const breedName = animal.breeds?.[0]?.name?.toLowerCase() || "";
        return breedName.includes(searchQuery.toLowerCase());
      });
      setFilteredAnimals(searchResult);
    }
    if (animalFilter !== "all") {
      searchResult = searchResult.filter(
        (animal) => animal.type === animalFilter
      );
    }

    if (breedFilter) {
      searchResult = searchResult.filter((animal) => {
        const breedName = animal.breeds?.[0]?.name?.toLowerCase() || "";
        return breedName === breedFilter.toLowerCase();
      });
    }

    setFilteredAnimals(searchResult);
  }, [searchQuery, animals, breedFilter, animalFilter]);

  const indexOfLastAnimal = currentPage * itemsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - itemsPerPage;
  const currentAnimals = filteredAnimals.slice(
    indexOfFirstAnimal,
    indexOfLastAnimal
  );

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleAnimalFilter = (type) => {
    setAnimalFilter(type);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="mx-[0px auto]">
        <div className="flex flex-wrap gap-5 items-center justify-center">
          <input
            type="text"
            placeholder="Search by breed..."
            className="p-2 outline-none border  m-5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-x-2">
            <button
              onClick={() => handleAnimalFilter("all")}
              className={`px-4 py-2 border ${
                animalFilter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleAnimalFilter("cat")}
              className={`px-4 py-2 border ${
                animalFilter === "cat"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Cats
            </button>
            <button
              onClick={() => handleAnimalFilter("dog")}
              className={`px-4 py-2 border ${
                animalFilter === "dog"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Dogs
            </button>
          </div>
          <select
            className="p-2 border"
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
          >
            <option value="">All Breeds</option>
            {animals
              .map((animal) => animal.breeds?.[0]?.name)
              .map((breed, index) => (
                <option key={`${breed}-${index}`} value={breed}>
                  {breed}
                </option>
              ))}
          </select>
        </div>
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="spinner-border" role="status">
              <Spinner aria-label="Default status example" />
            </div>
          </div>
        ) : errorMessage ? (
          <div className="text-red-500 text-center mt-10">{errorMessage}</div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-center ">
              {currentAnimals.map((animal) => {
                return (
                  <div
                    key={animal.id}
                    className="relative w-[350px] h-[250px] m-2 overflow-hidden group"
                  >
                    <img
                      src={animal.url}
                      alt={animal.type}
                      className="w-full h-full object-cover group"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-2 transform translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                      {animal?.breeds?.map?.((i) => {
                        return (
                          <div key={i?.id}>
                            <p className="text-lg font-bold">{i?.name}</p>
                            <p>{i?.temperament}</p>
                          </div>
                        );
                      })}
                      <div className="text-end mt-2">
                        <Link to={`/details/${animal?.type}/${animal?.id}`}>
                          <button className="bg-blue-500 text-white rounded px-3 py-1">
                            More Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 border ${
                  currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
              >
                Previous
              </button>
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border ${
                  currentPage === totalPages
                    ? "bg-gray-300"
                    : "bg-blue-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
