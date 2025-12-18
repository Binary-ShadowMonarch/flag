import type { FlagDefinition, ConstructionStep } from '../types';
import { NepalFlagBuilder } from '$lib/geometry/NepalFlagBuilder';

const constructionSteps: ConstructionStep[] = [
	{
		step: 1,
		description: 'Draw line AB from left to right',
		type: 'line',
		duration: 2,
		visible: true
	},
	{
		step: 2,
		description: 'Draw AC perpendicular to AB, AC = AB + 1/3 AB',
		type: 'line',
		duration: 2,
		visible: true
	},
	{
		step: 3,
		description: 'Mark D on AC where AD = AB, join B and D',
		type: 'line',
		duration: 2,
		visible: true
	},
	{
		step: 4,
		description: 'From BD mark off E making BE equal to AB',
		type: 'point',
		duration: 1,
		visible: true
	},
	{
		step: 5,
		description: 'Draw line FG parallel to AB, FG = AB',
		type: 'line',
		duration: 2,
		visible: true
	},
	{
		step: 6,
		description: 'Mark AH = 1/4 AB, draw HI parallel to AC',
		type: 'line',
		duration: 2,
		visible: true
	},
	{
		step: 7,
		description: 'Bisect CF at J, draw JK parallel to AB',
		type: 'line',
		duration: 2,
		visible: true
	},
	{
		step: 8,
		description: 'L is intersection of JK and HI',
		type: 'point',
		duration: 1,
		visible: true
	},
	{
		step: 9,
		description: 'Join J and G',
		type: 'line',
		duration: 1,
		visible: true
	},
	{
		step: 10,
		description: 'M is intersection of JG and HI',
		type: 'point',
		duration: 1,
		visible: true
	},
	{
		step: 11,
		description: 'With centre M, mark N on HI',
		type: 'point',
		duration: 1,
		visible: true
	},
	{
		step: 12,
		description: 'Draw line OM parallel to AB',
		type: 'line',
		duration: 1,
		visible: true
	},
	{
		step: 13,
		description: 'Centre L, radius LN, draw semi-circle',
		type: 'arc',
		duration: 2,
		visible: true
	},
	{
		step: 14,
		description: 'Centre M, radius MQ, draw semi-circle',
		type: 'arc',
		duration: 2,
		visible: true
	},
	{
		step: 15,
		description: 'Centre N, radius NM, draw arc',
		type: 'arc',
		duration: 2,
		visible: true
	},
	{
		step: 16,
		description: 'Centre T, radius TS, draw semi-circle',
		type: 'arc',
		duration: 2,
		visible: true
	},
	{
		step: 17,
		description: 'Centre T, radius TM, draw arc',
		type: 'arc',
		duration: 2,
		visible: true
	},
	{
		step: 18,
		description: 'Create 8 triangles for moon crescent',
		type: 'triangle',
		duration: 3,
		visible: true
	},
	{
		step: 19,
		description: 'Bisect AF at U, draw UV parallel to AB',
		type: 'line',
		duration: 2,
		visible: true
	},
	{
		step: 20,
		description: 'Centre W, radius MN, draw circle',
		type: 'circle',
		duration: 2,
		visible: true
	},
	{
		step: 21,
		description: 'Centre W, radius LN, draw circle',
		type: 'circle',
		duration: 2,
		visible: true
	},
	{
		step: 22,
		description: 'Create 12 triangles for sun rays',
		type: 'triangle',
		duration: 3,
		visible: true
	},
	{
		step: 23,
		description: 'Add deep blue border, width = TN',
		type: 'custom',
		duration: 2,
		visible: true
	},
	{
		step: 24,
		description: 'Complete flag construction',
		type: 'custom',
		duration: 2,
		visible: true
	}
];

export const nepalFlag: FlagDefinition = {
	id: 'nepal',
	name: 'National Flag of Nepal',
	country: 'Nepal 🇳🇵',
	type: 'pennon',
	officialSource: 'Constitution of Nepal, Schedule-1 (Relating to clause (2) of Article 8)',
	adoptedDate: '1962-12-16',
	colors: {
		primary: '#DC143C',
		secondary: '#FFFFFF',
		border: '#003893'
	},
	constructionSteps,
	buildGeometry: (scale: number) => {
		const builder = new NepalFlagBuilder(scale);
		return builder.build();
	},
	buildUpToStep: (scale: number, step: number) => {
		const builder = new NepalFlagBuilder(scale);
		return builder.buildUpToStep(step);
	}
};
