'use client';

import { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "../../../components/ui/popover";

// --- Added Interface ---
interface DummyResult {
  original: string;
  costBased: string;
  nutrientBased: { [key: string]: string };
  allergenFree: { [key: string]: string };
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [savedPreferences, setSavedPreferences] = useState<{ type: string; value: string }[]>([]);

  const filterOptions = [
    { label: "Cost-based Alternatives", value: "costBased" },
    { label: "Nutrient-based Alternatives", value: "nutrientBased" },
    { label: "Allergen-free Alternatives", value: "allergenFree" },
  ];

  const dummyResults: DummyResult[] = [
    {
      original: "Sugar",
      costBased: "Honey",
      nutrientBased: {
        "Low Sugar": "Stevia",
        "Low Calories": "Erythritol",
      },
      allergenFree: {
        "Lactose": "Maple Syrup",
      }
    },
    {
      original: "Butter",
      costBased: "Margarine",
      nutrientBased: {
        "Low Fat": "Avocado Puree",
      },
      allergenFree: {
        "Lactose": "Coconut Oil",
      }
    },
    {
      original: "Milk",
      costBased: "Powdered Milk",
      nutrientBased: {
        "Low Fat": "Almond Milk",
      },
      allergenFree: {
        "Lactose": "Oat Milk",
      }
    },
    {
      original: "Peanut Butter",
      costBased: "Sunflower Seed Butter",
      nutrientBased: {
        "Low Fat": "Powdered Peanut Butter",
      },
      allergenFree: {
        "Peanut": "Almond Butter",
      }
    },
  ];

  const handleFilterChange = (value: string) => {
    setFilters((prevFilters) =>
      prevFilters.includes(value)
        ? prevFilters.filter((filter) => filter !== value)
        : [...prevFilters, value]
    );
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    console.log('With filters:', filters);

    const matched = dummyResults.filter(item =>
      item.original.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formattedResults = matched.map(item => {
      let suggestion = item.original + " ➔ ";
      const suggestions = [];

      if (filters.includes("costBased")) {
        suggestions.push(`Cost-based: ${item.costBased}`);
      }

      if (filters.includes("nutrientBased") && item.nutrientBased) {
        savedPreferences
          .filter(pref => pref.type === 'Nutrient')
          .forEach(pref => {
            const match = item.nutrientBased[pref.value];
            if (match) {
              suggestions.push(`Nutrient (${pref.value}): ${match}`);
            }
          });
      }

      if (filters.includes("allergenFree") && item.allergenFree) {
        savedPreferences
          .filter(pref => pref.type === 'Allergy')
          .forEach(pref => {
            const match = item.allergenFree[pref.value];
            if (match) {
              suggestions.push(`Allergen-free (${pref.value}): ${match}`);
            }
          });
      }

      return suggestions.length > 0 ? suggestion + suggestions.join(", ") : suggestion + "No suitable alternative found.";
    });

    setResults(formattedResults);
  };

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setSavedPreferences(JSON.parse(saved));
    }
  }, []);

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#c9edb6',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        color: '#4f4f4f',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Ingredient Substitution Search</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <Input
          type="text"
          placeholder="Enter Ingredient"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #a2a2a2',
            backgroundColor: '#b0b0b0',
            color: 'white',
          }}
        />

        <Popover>
          <PopoverTrigger>
            <Button
              variant="outline"
              onClick={() => setPopoverOpen(!popoverOpen)}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                height: '36px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
              }}
            >
              Select Filters
            </Button>
          </PopoverTrigger>

          {popoverOpen && (
            <PopoverContent className="bg-white shadow-lg rounded-md p-4">
              {filterOptions.map((option) => (
                <label key={option.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Checkbox
                    checked={filters.includes(option.value)}
                    onChange={() => handleFilterChange(option.value)}
                    style={{ marginRight: '8px' }}
                  />
                  {option.label}
                </label>
              ))}
            </PopoverContent>
          )}
        </Popover>

        <Button
          onClick={handleSearch}
          style={{
            padding: '8px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '6px',
            fontSize: '14px',
            height: '36px',
            border: 'none',
          }}
        >
          Search
        </Button>
      </div>

      <div
        style={{
          padding: '20px',
          borderRadius: '6px',
          boxShadow: '0 0 5px rgba(0,0,0,0.1)',
          border: '1px solid #a2a2a2',
          backgroundColor: '#b0b0b0',
          color: '#4f4f4f',
        }}
      >
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>{result}</div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No results yet</p>
        )}
      </div>
    </div>
  );
}
