import { createContext, useState, useContext, useMemo } from 'react';

type CachedAssets = {
  [key: string]: File;
};

interface CreateAssetContext {
  cachedNewlyCreatedAssets: CachedAssets;
  updateCachedNewlyCreatedAssets: (updatedAsset: CachedAssets) => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const CreateAssetContext = createContext<CreateAssetContext>({
  cachedNewlyCreatedAssets: {},
  updateCachedNewlyCreatedAssets: () => {},
});

export const useCreateAssetContext = (): CreateAssetContext => {
  const context = useContext(CreateAssetContext);
  return context;
};

export const CreateAssetProvider = ({ children }: Props): JSX.Element => {
  const [
    cachedNewlyCreatedAssets,
    setCachedNewlyCreatedAssets,
  ] = useState<CachedAssets>({});

  const updateCachedNewlyCreatedAssets = async (
    newCachedAsset: CachedAssets
  ) => {
    const updatedCachedAssets = Object.assign(
      {},
      cachedNewlyCreatedAssets,
      newCachedAsset
    );
    setCachedNewlyCreatedAssets(updatedCachedAssets);
  };

  const value = useMemo<CreateAssetContext>(
    () => ({
      updateCachedNewlyCreatedAssets,
      cachedNewlyCreatedAssets,
    }),
    [cachedNewlyCreatedAssets]
  );

  return (
    <CreateAssetContext.Provider value={value}>
      {children}
    </CreateAssetContext.Provider>
  );
};
