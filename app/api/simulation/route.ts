/* eslint-disable no-empty */

import { NextResponse } from 'next/server';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'node:fs/promises';

// Types
import { Form } from '@/_private/types/lib/formTypes';
import { PostSimulation } from '@/_private/types/api';

// Utils
import {
  formatCurrentDate, formatCurrentTime, getScript, getSelectedVersion,
} from '@/_private/utils/pages';
import {
  getGridRunWorkflowBody, getLocalRunWorkflowBody, getSegment,
} from '@/_private/utils/api';

// Constants
import { SCRIPTS_PATH } from '@/_private/lib/constants/apiConstants';

export async function POST(request: Request): Promise<PostSimulation> {
  const form: Form = await request.json();

  try {
    const currentDate: Date = new Date();
    const id: string = uuidv4();
    const version: string = getSelectedVersion(form.version);
    const script: string = (form.advanced && form.script !== null)
      ? form.script
      : getScript(form.createWorkflow, form.runWorkflow);

    const absolutePath: string = getSegment(process.cwd(), SCRIPTS_PATH);
    const absoluteSegment: string = getSegment(absolutePath, id);

    const localRunWorkflow = {
      scriptPath: path.join(absoluteSegment, 'localRunWorkflow.sh'),
      scriptBody: getLocalRunWorkflowBody(version, script),
      scriptStatus: 'Staged',
      stderrData: null,
      stdoutData: null,
    };

    const gridRunWorkflow = {
      scriptPath: path.join(absoluteSegment, 'gridRunWorkflow.sh'),
      scriptBody: getGridRunWorkflowBody(version, script),
      scriptStatus: 'Staged',
      stderrData: null,
      stdoutData: null,
    };

    // Create directory for scripts
    await fs.mkdir(absoluteSegment, { recursive: true });
    await fs.chmod(absoluteSegment, '755');

    // Write script files
    await fs.writeFile(localRunWorkflow.scriptPath, localRunWorkflow.scriptBody);
    await fs.chmod(localRunWorkflow.scriptPath, '755');
    await fs.writeFile(gridRunWorkflow.scriptPath, gridRunWorkflow.scriptBody);
    await fs.chmod(gridRunWorkflow.scriptPath, '755');

    return NextResponse.json({
      id,
      date: `${formatCurrentDate(currentDate)} • ${formatCurrentTime(currentDate)}`,
      form: {
        ...form,
        script,
        title: form.title || `Simulation created on ${formatCurrentDate(currentDate)} at ${formatCurrentTime(currentDate)}`,
      },
      scripts: { localRunWorkflow, gridRunWorkflow },
    }, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<PostSimulation> {
  const id: string = await request.json();

  try {
    const segment: string = getSegment(SCRIPTS_PATH, id);

    try {
      await fs.access(segment);
      await fs.rm(segment, { recursive: true });
    } catch {}

    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
