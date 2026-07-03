import syntheticCandidate from './synthetic-candidate.json';
import invisibleEpidemic from './invisible-epidemic.json';
import theCrossing from './the-crossing.json';
import theVoid from './the-void.json';
import theJump from './the-jump.json';
import theDayOf from './the-day-of.json';
import sovereignDnaMandate from './sovereign-dna-mandate.json';
import exportControlPrecedent from './export-control-precedent.json';

export const CORE_SCENARIOS = [syntheticCandidate, invisibleEpidemic];
export const WORKSHOP_SCENARIOS = [theCrossing, theVoid, theJump, theDayOf];
export const TOPICAL_SCENARIOS = [sovereignDnaMandate, exportControlPrecedent];
export const ALL_SCENARIOS = [...CORE_SCENARIOS, ...WORKSHOP_SCENARIOS, ...TOPICAL_SCENARIOS];
