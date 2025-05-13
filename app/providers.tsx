'use client';

import React from 'react';
import { NextUIProvider } from '@nextui-org/react';

// Context
import { SimulationProvider } from './_private/context/SimulationContext';

export default function Providers(
  { children }
  :
  { children: React.ReactNode },
) {
  return (
    <NextUIProvider>
      <SimulationProvider>
        {children}
      </SimulationProvider>
    </NextUIProvider>
  );
}
