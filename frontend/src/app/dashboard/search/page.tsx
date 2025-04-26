'use client';

import { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "../../../components/ui/popover";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const filterOptions = [
    { label: "Cost-based Alternatives", value: "costBased" },
    { label: "Nutrient-based Alternatives", value: "nutrientBased" },
    { label: "Allergen-free Alternatives", value: "allergenFree" },
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

    const dummyResults = [
      {
        original: "Sugar",
        costBased: "Honey",
        nutrientBased: "Stevia",
        allergenFree: "Maple Syrup",
      },
      {
        original: "Butter",
        costBased: "Margarine",
        nutrientBased: "Avocado Puree",
        allergenFree: "Coconut Oil",
      },
      {
        original: "Milk",
        costBased: "Powdered Milk",
        nutrientBased: "Almond Milk",
        allergenFree: "Oat Milk",
      },
    ];

    const matched = dummyResults.filter(item =>
      item.original.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formattedResults = matched.map(item => {
      let suggestion = item.original + " ➔ ";
      const suggestions = [];
      if (filters.includes("costBased")) suggestions.push(`Cost-based: ${item.costBased}`);
      if (filters.includes("nutrientBased")) suggestions.push(`Nutrient-based: ${item.nutrientBased}`);
      if (filters.includes("allergenFree")) suggestions.push(`Allergen-free: ${item.allergenFree}`);
      return suggestion + suggestions.join(", ");
    });

    setResults(formattedResults);
  };

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
            border: '1px solid #ddd',
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
            backgroundColor: '#6b7280', // grayish
            color: '#fff',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '14px',
            height: '36px',
          }}
        >
          Search
        </Button>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '6px',
          boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        }}
      >
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} style={{ color: '#4f4f4f', marginBottom: '10px' }}>{result}</div>
          ))
        ) : (
          <p style={{ color: '#aaa', textAlign: 'center' }}>No results yet</p>
        )}
      </div>
    </div>
  );
}
