import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCallbackRef } from "./useCallbackRef";

// Implementation based on
// Ref: https://github.com/radix-ui/primitives/blob/49ba47a3a0a6776d587ca6fc79926521245f81a4/packages/react/use-controllable-state/src/useControllableState.tsx#L12

type UseControllableStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

type SetStateFn<T> = (prevState?: T) => T;

/**
 * A custom hook that used to handle both controlled and uncontrolled state scenarios
 */
const useControllableState = <T>({
  prop,
  defaultProp,
  onChange = () => undefined,
}: UseControllableStateParams<T>) => {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (nextValue) => {
      if (isControlled) {
        const setter = nextValue as SetStateFn<T>;
        const value =
          typeof nextValue === "function" ? setter(prop) : nextValue;
        if (value !== prop) handleChange(value as T);
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange],
  );

  return [value, setValue] as const;
};

const useUncontrolledState = <T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, "prop">) => {
  const uncontrolledState = useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = useRef(value);
  const handleChange = useCallbackRef(onChange);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
};

export default useControllableState;
