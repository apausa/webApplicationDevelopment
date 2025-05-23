import * as fs from 'node:fs/promises';
import path from 'node:path';

// Types
import {
  Script,
} from '@/_private/types/lib/simulationTypes';
import { LocalRunArgs } from '../types/api';

export const getSegment = (segment1: string, segment2: string): string => (
  path.join(segment1, segment2));

export const readFile = async (workflowPath: string): Promise<string> => (
  fs.readFile(workflowPath, { encoding: 'utf-8' }));

export const createFile = async (
  segment: string,
  { scriptPath, scriptBody }: Script,
): Promise<void> => {
  try {
    await fs.access(segment);
  } catch {
    await fs.mkdir(segment);
    await fs.chmod(segment, '755');
  }

  await fs.writeFile(scriptPath, scriptBody);
  await fs.chmod(scriptPath, '755');
};

export const getLocalArgs = (segment: string, scriptPath: string): LocalRunArgs => [
  // 'exec',
  // '-C',
  // '-B',
  // `/cvmfs:/cvmfs,${segment}:${segment}`,
  // '--pwd',
  // `${segment}`,
  // '/cvmfs/alice.cern.ch/containers/fs/singularity/rel8-alice-20220503',
  '/bin/bash',
  // '-c',
  scriptPath,
];

const getLocalBodyOriginal = (version: string, script: string): string => ([
  `eval $(/cvmfs/alice.cern.ch/bin/alienv printenv O2sim/${version})`,
  'pip install graphviz',
  `${script} --visualize-workflow`,
].join('\n\n'));

const MOCK_WORKFLOW = `digraph mygraph {
  fontname="Helvetica,Arial,sans-serif"
  node [fontname="Helvetica,Arial,sans-serif"]
  edge [fontname="Helvetica,Arial,sans-serif"]
  node [shape=box];
  "//absl/random:random"
  "//absl/random:random" -> "//absl/random:distributions"
  "//absl/random:random" -> "//absl/random:seed_sequences"
  "//absl/random:random" -> "//absl/random/internal:pool_urbg"
  "//absl/random:random" -> "//absl/random/internal:nonsecure_base"
  "//absl/random:distributions"
  "//absl/random:distributions" -> "//absl/strings:strings"
  "//absl/random:seed_sequences"
  "//absl/random:seed_sequences" -> "//absl/random/internal:seed_material"
  "//absl/random:seed_sequences" -> "//absl/random/internal:salted_seed_seq"
  "//absl/random:seed_sequences" -> "//absl/random/internal:pool_urbg"
  "//absl/random:seed_sequences" -> "//absl/random/internal:nonsecure_base"
  "//absl/random/internal:nonsecure_base"
  "//absl/random/internal:nonsecure_base" -> "//absl/random/internal:pool_urbg"
  "//absl/random/internal:nonsecure_base" -> "//absl/random/internal:salted_seed_seq"
  "//absl/random/internal:nonsecure_base" -> "//absl/random/internal:seed_material"
  "//absl/random/internal:pool_urbg"
  "//absl/random/internal:pool_urbg" -> "//absl/random/internal:seed_material"
  "//absl/random/internal:salted_seed_seq"
  "//absl/random/internal:salted_seed_seq" -> "//absl/random/internal:seed_material"
  "//absl/random/internal:seed_material"
  "//absl/random/internal:seed_material" -> "//absl/strings:strings"
  "//absl/strings:strings"
}`;

export const getGridBodyOriginal = (version: string, script: string): string => ([
  `#JDL_PACKAGE=O2sim::${version}`,
  '#JDL_OUTPUT=*.root@disk=1,*.log@disk=1',
  script,
].join('\n\n'));

export const getLocalBodyCommented = (version: string, script: string): string => ([
  '#!/bin/bash',
  '',
  'sleep 10',
  '',
  'cat > workflow.gv << \'EOF\'',
  MOCK_WORKFLOW,
  'EOF',
  'chmod +x workflow.gv',
  '',
  '# ORIGINAL CONTENT (COMMENTED OUT FOR DEMONSTRATION):',
  `# ${getLocalBodyOriginal(version, script).replace(/\n\s*/g, ' ')}`,
].join('\n'));
