import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definir la interfaz para el contexto

interface IsLoggedType {
  isLogged: boolean,
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
}

// Crear el contexto con un valor inicial null

const LoggedContext = createContext<IsLoggedType | null>(null)

// Crear un proveedor de contexto

interface LoggedProviderProps {
  children: ReactNode
}

export const LoggedProvider = ({ children }: LoggedProviderProps) => {
  const [isLogged, setIsLogged] = useState<boolean>(false)

  return (
    <LoggedContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </LoggedContext.Provider>
  )
}

// Hook personalizado para usar el contexto

export const useLogged = () => {
  const context = useContext(LoggedContext)
  if (!context) {
    throw new Error('useLogged debe usarse dentro de un LoggedProvider')
  }
  return context
}