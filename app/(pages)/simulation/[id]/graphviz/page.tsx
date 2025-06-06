/* eslint-disable consistent-return */

'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { notFound, useRouter } from 'next/navigation';
import { graphviz } from 'd3-graphviz';

// Types
import { Button, Link, Spinner } from '@nextui-org/react';
import { Simulation } from '@/_private/types/lib/simulationTypes';

// Actions
import simulationActionCreators from '@/_private/lib/actions/simulationActions';

// Components
import DeleteButton from '@/_private/components/details/detailsFooter/DeleteButton';
import RecreateButton from '@/_private/components/details/detailsFooter/RecreateButton';

// Context
import { useSimulation } from '@/_private/context/SimulationContext';

export default function GraphvizPage(
  { params: { id } }:
  { params: { id: string } },
) {
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [rendered, setRendered] = useState<null | boolean>(null);
  const [deleted, setDeleted] = useState(false);
  const [simulations, dispatchSimulation] = useSimulation();

  // First, gets simulations
  useEffect(() => {
    simulationActionCreators.readAllSimulations(dispatchSimulation);
  }, []);

  // Then, finds simulation
  const selectedSimulation: Simulation | undefined = useMemo(() => simulations.find(
    (simulation: Simulation): boolean => (simulation.id === id),
  ), [simulations, id]);

  const onSimulation = (): void => {
    const {
      scripts: {
        localRunWorkflow: { graphvizData, scriptStatus },
      },
    }: Simulation = selectedSimulation!;

    switch (scriptStatus) {
      case 'Staged': {
        if (selectedSimulation) {
          const unresolvedSimulation: Simulation = {
            ...selectedSimulation,
            scripts: {
              ...selectedSimulation.scripts,
              localRunWorkflow: {
                ...selectedSimulation.scripts.localRunWorkflow,
                scriptStatus: 'Running',
              },
            },
          };

          simulationActionCreators.updateSimulation(dispatchSimulation, unresolvedSimulation);

          simulationActionCreators.runSimulationScript(
            dispatchSimulation,
            unresolvedSimulation,
            'localRunWorkflow',
          );
        }

        break;
      }
      case 'Completed':
        if (graphvizData) {
          const container = ref.current;

          if (container) {
            const containerRect = container.getBoundingClientRect();

            graphviz(ref.current)
              .width(containerRect.width)
              .height(containerRect.height)
              .fit(true)
              .renderDot(graphvizData)
              .on('end', () => { setRendered(true); });
          }
        } else {
          setRendered(false);
        }
        break;
      case 'Error':
        setRendered(false);
        break;
      default:
        break;
    }
  };

  useEffect((): void => {
    if (!selectedSimulation && deleted) router.push('/');
    else if (loading) setLoading(false);

    if (selectedSimulation) onSimulation();
  }, [selectedSimulation, deleted]);

  if (deleted) return null;

  if ((!loading && !selectedSimulation) || (rendered === false)) return notFound();

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b border-b-neutral-800 flex justify-between">
        <Button
          href={`/simulation/${id}`}
          variant="light"
          as={Link}
        >
          Back
        </Button>
        <div className="pt-2">Job visualization</div>
        <Button className="invisible" />
      </header>
      <main className="flex-1 overflow-auto">
        <div ref={ref} className="h-full w-full">
          {!rendered && <Spinner className="pt-2 flex justify-center" />}
        </div>
      </main>
      <footer className="p-4 border-t border-t-neutral-800 ">
        {(loading)
          ? <Spinner className="flex justify-center" />
          : (
            <div className="flex justify-between">
              <DeleteButton
                selectedSimulation={selectedSimulation as Simulation}
                setDeleted={setDeleted}
              />
              <RecreateButton
                selectedSimulation={selectedSimulation as Simulation}
                isOpen={false}
                onClose={() => {}}
              />
            </div>
          )}
      </footer>
    </div>
  );
}
