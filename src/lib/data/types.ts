// ============================================================================
// src/lib/data/types.ts
// ============================================================================

export interface Point2D {
	x: number;
	y: number;
}

export interface Point3D extends Point2D {
	z: number;
}

export interface ConstructionStep {
  step: number; // link to ConstructionStep
  id?: string;
  type: 'line' | 'point' | 'arc' | 'circle' | 'triangle' | 'custom';
  points: Point2D[]; // for line/arc/circle -> pre-sampled polyline
  triangles?: Point2D[][]; // for triangle type: each triangle as 3 points
  center?: Point2D;
  radius?: number;
  params?: Record<string, any>;
  label?: string;
  color?: string;
  dashed?: boolean;
}

export interface ConstructionStepData {
	type: 'line' | 'point' | 'arc' | 'circle';
	points: Point2D[];
	label?: string;
	color?: string;
	dashed?: boolean;
}

export interface FlagColors {
	primary: string;
	secondary: string;
	border?: string;
	[key: string]: string | undefined;
}

export interface FlagDecoration {
	type: 'star' | 'moon' | 'sun' | 'emblem' | 'stripe' | 'custom';
	position: Point3D;
	scale: number;
	rotation?: Point3D;
	color: string;
	params?: Record<string, any>;
}

export interface GeometryResult {
	shape: Point2D[];
	decorations: FlagDecoration[];
	dimensions: {
		width: number;
		height: number;
		[key: string]: number;
	};
	constructionLines?: ConstructionStepData[];
}

export interface FlagDefinition {
	id: string;
	name: string;
	country: string;
	type: 'pennon' | 'rectangular' | 'triangular' | 'custom';
	officialSource: string;
	adoptedDate?: string;
	colors: FlagColors;
	constructionSteps: ConstructionStep[];
	buildGeometry: (scale: number) => GeometryResult;
	buildUpToStep?: (scale: number, step: number) => GeometryResult;
}
