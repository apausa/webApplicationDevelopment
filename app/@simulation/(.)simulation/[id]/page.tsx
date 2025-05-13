'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { notFound, usePathname, useRouter } from 'next/navigation';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

// Components
import DetailsMain from '@/_private/components/details/detailsMain/DetailsMain';
import DeleteButton from '@/_private/components/details/detailsFooter/DeleteButton';
import RecreateButton from '@/_private/components/details/detailsFooter/RecreateButton';

// Types
import { Simulation } from '@/_private/types/lib/simulationTypes';

// Context
import { useSimulation } from '@/_private/context/SimulationContext';

export default function DetailsModal(
  {
    params: { id },
  }: {
    params: { id: string }
  },
) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathName = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [simulations] = useSimulation();

  // First, opens modal
  useEffect((): void => {
    if (pathName.startsWith('/simulation')) {
      onOpen();
    }
  }, [pathName]);

  // Then, finds simulation
  const selectedSimulation = useMemo((): Simulation | undefined => (
    simulations.find((simulation: Simulation): boolean => simulation.id === id)
  ), [simulations, id]);

  const handleClose = (): void => {
    onClose();
    router.push('/');
  };

  useEffect(() => {
    if (!selectedSimulation && deleted) handleClose();
    else if (loading) setLoading(false);
  }, [selectedSimulation, deleted]);

  if (deleted) return null;

  if (!loading && !selectedSimulation) return notFound();

  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      scrollBehavior="inside"
      onClose={handleClose}
      isDismissable={false}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="border-b border-b-neutral-800">
          <div className="pt-2">
            &apos;
            {selectedSimulation?.form.title}
            &apos;
            {' '}
            details
          </div>
        </ModalHeader>
        <ModalBody className="pb-0 gap-0">
          {(loading)
            ? (<Spinner className="flex justify-center" />)
            : (
              <DetailsMain
                selectedSimulation={selectedSimulation as Simulation}
              />
            )}
        </ModalBody>
        <ModalFooter className="border-t border-t-neutral-800 flex justify-between">
          {(loading)
            ? (<Spinner />)
            : (
              <>
                <DeleteButton
                  selectedSimulation={selectedSimulation as Simulation}
                  setDeleted={setDeleted}
                />
                <RecreateButton
                  selectedSimulation={selectedSimulation as Simulation}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              </>
            )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
