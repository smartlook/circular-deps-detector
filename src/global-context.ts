import { ProgressBar } from '@opentf/cli-pbar'
import { Project } from 'ts-morph'

import { Stack } from './stack'
import { IConfig } from './config'
import { NonTTYProgressBar } from './non-tty-progress-bar'
import { IProgressBar } from './types'

export interface IGlobalContext {
	config: IConfig
	project: Project | undefined
	totalFileCount: number
	visitedPaths: string[]
	currentStack: Stack<string>
	cycles: string[][]
	progressBar: IProgressBar
}

export const GlobalContext: IGlobalContext = {
	config: {} as IConfig,
	project: undefined,
	totalFileCount: 0,
	visitedPaths: [],
	currentStack: new Stack(),
	cycles: [],
	// Some CLIs do not have a TTY, so we need to check for that.
	progressBar: (!!process.stdout.cursorTo as unknown) ? new ProgressBar({
		color: 'teal',
		autoClear: true,
	}) : new NonTTYProgressBar(),
}
