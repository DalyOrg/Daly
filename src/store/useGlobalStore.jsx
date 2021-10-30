import React, { useContext } from "react";

export const GlobalStoreContext = React.createContext([]);

export const useGlobalStore = () => useContext(GlobalStoreContext);