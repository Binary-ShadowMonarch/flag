// src/lib/data/flags/index.ts

import { nepalFlag } from './nepal';
import type { FlagDefinition } from '../types';

export const FLAG_REGISTRY: Record<string, FlagDefinition> = {
	nepal: nepalFlag
};

export function getFlag(id: string): FlagDefinition | undefined {
	return FLAG_REGISTRY[id];
}

export function getAllFlags(): FlagDefinition[] {
	return Object.values(FLAG_REGISTRY);
}
