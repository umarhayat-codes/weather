import {
  SliceSimulator,
  getSlices,
} from "@slicemachine/adapter-next/simulator";
import { SliceZone } from "@prismicio/react";

import { components } from "../../slices";

interface SliceSimulatorPageProps {
  searchParams: Promise<{ state?: string }>;
}

export default async function SliceSimulatorPage({ searchParams }: SliceSimulatorPageProps) {
  const { state } = await searchParams;
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceZone slices={slices} components={components} />
    </SliceSimulator>
  );
}
