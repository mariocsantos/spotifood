import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';

import Spotify, { FeaturedPlaylistFilter } from '../services/spotify';

interface FeaturedPlaylistContextData {
  loading: boolean;
  playlists: any;
  search: string;
  filter: FeaturedPlaylistFilter;
  setSearch: (filter: string) => void;
  setFilter: (filter: FeaturedPlaylistFilter) => void;
}

const FeaturedPlaylistContext = createContext<FeaturedPlaylistContextData>(
  {} as FeaturedPlaylistContextData,
);

const FeaturedPlaylistProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState({} as FeaturedPlaylistFilter);

  const [search, setSearch] = useState('');

  const [playlists, setPlaylists] = useState([]);

  const getFeaturedPlaylists = useCallback(async () => {
    setLoading(true);

    try {
      const { items } = await Spotify.getFeaturedPlaylists(filter);
      setPlaylists(items);
    } catch (error) {
      setPlaylists([]);
      // show error
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const filteredPlaylists = playlists.filter(({ name }: any) => name.includes(search.trim()));

  useEffect(() => {
    getFeaturedPlaylists();
  }, [getFeaturedPlaylists]);

  return (
    <FeaturedPlaylistContext.Provider value={{
      loading,
      filter,
      setFilter,
      playlists: filteredPlaylists,
      search,
      setSearch,
    }}
    >
      {children}
    </FeaturedPlaylistContext.Provider>
  );
};

function useFeaturedPlaylist(): FeaturedPlaylistContextData {
  const context = useContext(FeaturedPlaylistContext);

  if (!context) {
    throw new Error('useFeaturedPlaylist must be used within an FeaturedPlaylistProviver');
  }

  return context;
}

export { FeaturedPlaylistProvider, useFeaturedPlaylist };