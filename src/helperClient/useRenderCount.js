"use client";

import { useState, useEffect } from "react";

const useRenderCounter = () => {
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount((prevCount) => prevCount + 1);
    console.log("Component has been re-rendered:", renderCount + 1);
  }, []);

  return renderCount;
};

export default useRenderCounter;
