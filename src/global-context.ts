import { ProgressBar } from '@opentf/cli-pbar'
import { Project } from 'ts-morph'

import { Stack } from './stack'
import { IConfig } from './config'

export interface IGlobalContext {
	config: IConfig
	project: Project | undefined
	totalFileCount: number
	visitedPaths: string[]
	currentStack: Stack<string>
	cycles: string[][]
	progressBar: ProgressBar
}

export const GlobalContext: IGlobalContext = {
	config: {} as IConfig,
	project: undefined,
	totalFileCount: 0,
	visitedPaths: [],
	currentStack: new Stack(),
	cycles: [],
	progressBar: new ProgressBar({
		color: 'teal',
		autoClear: true,
	}),
}
