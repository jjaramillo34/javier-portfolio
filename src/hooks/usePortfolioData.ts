import { useState, useEffect } from 'react';
import { PortfolioData } from '../types/portfolio';
import { fetchPortfolioDataFromContentful, isContentfulConfigured } from '../services/contentful';

const fetchLocalPortfolioData = async (): Promise<PortfolioData> => {
  const response = await fetch('/data/portfolio-data.json');
  if (!response.ok) {
    throw new Error('Failed to fetch local portfolio data');
  }
  return response.json() as Promise<PortfolioData>;
};

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cmsEnabled = isContentfulConfigured;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (cmsEnabled) {
          try {
            const portfolioData = await fetchPortfolioDataFromContentful();
            setData(portfolioData);
            return;
          } catch (cmsError) {
            console.warn('[Contentful] Falling back to local JSON data', cmsError);
          }
        }

        const localData = await fetchLocalPortfolioData();
        setData(localData);
      } catch (err) {
        console.error('Failed to load portfolio data', err);
        setData(null);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cmsEnabled]);

  return { data, loading, error };
};
