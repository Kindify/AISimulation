// Central scenario loader
// To add a new scenario: create a JSON file in this directory and add it to the array below

import syntheticCandidate from './synthetic-candidate.json';
import invisibleEpidemic from './invisible-epidemic.json';
import theCrossing from './the-crossing.json';
import theVoid from './the-void.json';
import theJump from './the-jump.json';
import theDayOf from './the-day-of.json';

export const CORE_SCENARIOS = [syntheticCandidate, invisibleEpidemic];
export const WORKSHOP_SCENARIOS = [theCrossing, theVoid, theJump, theDayOf];
export const ALL_SCENARIOS = [...CORE_SCENARIOS, ...WORKSHOP_SCENARIOS];
