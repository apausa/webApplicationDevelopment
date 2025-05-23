import { Tab, Tabs } from '@nextui-org/react';
import React from 'react';

// Components
import SimulationTab from './simulationTab/SimulationTab';

// Types
import { Simulation } from '@/_private/types/lib/simulationTypes';

export default function SimulationMain({
  selectedSimulation,
}: {
  selectedSimulation: Simulation,
}) {
  return (
    <div className="mb-2">
      <Tabs aria-label="Select environment" className="m-0 py-2 flex flex-col">
        <Tab
          key="Local run workflow"
          title="Local run"
          className="px-0 py-2 flex flex-col"
        >
          <SimulationTab
            selectedSimulation={selectedSimulation}
            script="localRunWorkflow"
          />
        </Tab>
        <Tab
          key="WLCG run workflow"
          title="WLCG run"
          className="px-0 py-2 flex flex-col"
        >
          <SimulationTab
            selectedSimulation={selectedSimulation}
            script="gridRunWorkflow"
          />
        </Tab>
      </Tabs>
    </div>
  );
}
