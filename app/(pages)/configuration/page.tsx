'use client';

import React, {
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Button, Spinner } from '@nextui-org/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Reducers
import formReducer from '@/_private/lib/reducers/formReducer';

// Constants
import INITIAL_FORM from '@/_private/lib/constants/formConstants';

// Components
import ConfigurationMain from '@/_private/components/configuration/configurationMain/ConfigurationMain';

// Actions
import simulationActionCreators from '@/_private/lib/actions/simulationActions';
import formActionCreators from '@/_private/lib/actions/formActions';

// Context
import { useSimulation } from '@/_private/context/SimulationContext';

export default function ConfigurationPage() {
  const [loading, setLoading] = useState(true);
  const [, dispatchSimulation] = useSimulation();
  const [form, dispatchForm] = useReducer(formReducer, null);

  const onStage = async (): Promise<void> => {
    await simulationActionCreators.createSimulation(dispatchSimulation, form);
  };

  const onReset = (): void => {
    formActionCreators.createForm(dispatchForm, INITIAL_FORM);
  };

  useEffect(() => {
    simulationActionCreators.readAllSimulations(dispatchSimulation);
    formActionCreators.readForm(dispatchForm);
  }, []);

  useEffect(() => {
    if (form) setLoading(false);
  }, [form]);

  if (!loading && !form) return notFound();

  return (
    <>
      <header className="p-4 border-b border-b-neutral-800 flex justify-between">
        <Button
          href="/"
          as={Link}
          variant="light"
        >
          Back
        </Button>
        <div className="pt-2">Job configuration</div>
        <Button className="invisible" />
      </header>
      <main className="px-4 py-2 mb-auto overflow-auto">
        {loading
          ? <Spinner className="flex justify-center" />
          : <ConfigurationMain form={form} dispatchForm={dispatchForm} />}
      </main>
      <footer className="p-4 border-t border-t-neutral-800 flex justify-between">
        <Button
          onClick={onReset}
          variant="light"
          isDisabled={loading}
        >
          Reset
        </Button>
        <Button
          href="/"
          as={Link}
          color="primary"
          onClick={onStage}
          isDisabled={loading}
        >
          Stage
        </Button>
      </footer>
    </>
  );
}
