import { join } from 'path'
import { z } from 'zod'
import { readFileSync } from 'fs-extra'
import { exitWithError } from './utils'

export const configSchema = z.object({
	projectName: z.string(),
	rootDir: z.string(),
	tsConfig: z.string(),
	entryPoint: z.string(),
	outputFile: z.string(),
	ignorePatterns: z.array(z.string()).optional().default([]),
})

export type IConfig = z.infer<typeof configSchema>

export function readConfig(relativeConfigPath: string) {
	try {
		const cwd = process.cwd()
		const absoluteConfigPath = join(cwd, relativeConfigPath)
		const fileContent = readFileSync(absoluteConfigPath, { encoding: 'utf8' })
		const parsedContent = JSON.parse(fileContent)
		const config = configSchema.parse(parsedContent)
		config.rootDir = join(cwd, config.rootDir)
		config.tsConfig = join(cwd, config.tsConfig)
		config.entryPoint = join(cwd, config.entryPoint)
		config.outputFile = join(cwd, config.outputFile)
		return config
	} catch (error) {
		console.error(error)
		return exitWithError('Could not read or parse config file.')
	}
}
