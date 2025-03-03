import { useContext } from "react";
import { CetusClientContext } from "../context/CetusClientContext";

export const useCetusClient = () => {
  const context = useContext(CetusClientContext);

  if (context === undefined) {
    throw new Error("useCetusClient must be used within a CetusClientProvider");
  }

  return context;
};
