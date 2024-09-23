import { useState, useEffect, useLayoutEffect } from 'react';

// prevent warning in server-side render
const useSSRLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function usePersistedState<StateT>(
  defaultState: StateT,
  key: string,
  serialize: (state: StateT) => string,
  deserialize: (str: string) => StateT
): [StateT, React.Dispatch<React.SetStateAction<StateT>>] {
  const [state, setState] = useState<StateT>(defaultState);
  useEffect(() => {
    localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);
  useSSRLayoutEffect(() => {
    const prevValue = localStorage.getItem(key);
    if (prevValue != null) {
      setState(deserialize(prevValue));
    }
  }, []);
  return [state, setState];
}
