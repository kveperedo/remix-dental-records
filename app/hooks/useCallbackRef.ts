import * as React from "react";

// Implementation based on
// Ref: https://github.com/radix-ui/primitives/blob/b14ac1fff0cdaf45d1ea3e65c28c320ac0f743f2/packages/react/use-callback-ref/src/useCallbackRef.tsx#L7

/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */
const useCallbackRef = <T extends (...args: any[]) => any>(
  callback: T | undefined,
): T => {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  return React.useMemo(
    () => ((...args) => callbackRef.current?.(...args)) as T,
    [],
  );
};

export { useCallbackRef };
