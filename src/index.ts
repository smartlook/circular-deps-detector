import { writeFileSync } from 'fs-extra'
import { Project } from 'ts-morph'
import { checkCliArgs } from './cli'
import { readConfig } from './config'
import { GlobalContext } from './global-context'
import { processFile } from './process-file'
import { processReport, exitWithError, findSubCycles } from './utils'

main()

function main() {
	// Check CLI arguments and get config path.
	const { configPath } = checkCliArgs()

	// Load config.
	console.info('Loading config...')
	const config = readConfig(configPath)

	// Load TS project.
	console.info('Loading project...')
	const project = new Project({ tsConfigFilePath: config.tsConfig })
	const entryPoint = project.getSourceFile(config.entryPoint)
	if (!entryPoint) {
		return exitWithError(`Entry point file not found: ${config.entryPoint}`)
	}

	// Filter relevant files.
	const relevantFiles = project
		.getSourceFiles()
		.map((file) => file.getFilePath())
		.filter((path) => path.includes(config.rootDir))
		.filter((path) => config.ignorePatterns.every((pattern) => new RegExp(pattern).test(path) === false))
	const relevantFilesCount = relevantFiles.length
	console.info(`Found ${relevantFilesCount} relevant source files.`)

	// Initialize global context with config and project.
	GlobalContext.config = config
	GlobalContext.project = project
	GlobalContext.totalFileCount = relevantFilesCount

	// Process all files recursively.
	GlobalContext.progressBar.start({ total: relevantFilesCount })
	processFile(entryPoint.getFilePath())
	GlobalContext.progressBar.stop('All files processed.')
	console.info('Number of cycles:', GlobalContext.cycles.length)

	// Find sub-cycles.
	const subCycles = findSubCycles(GlobalContext.cycles)
	console.info('Number of sub-cycles:', subCycles.length)

	// Find unused files.
	const unusedFiles = relevantFiles.filter((path) => !GlobalContext.visitedPaths.includes(path))
	console.info('Number of unused files:', unusedFiles.length)

	// Write output.
	console.info('Writing report...')
	const report = processReport({
		projectName: GlobalContext.config.projectName,
		cycles: GlobalContext.cycles,
		subCycles,
		unusedFiles,
	})
	const outputFileContent = JSON.stringify(report, null, 2)
	writeFileSync(GlobalContext.config.outputFile, outputFileContent)

	console.info('Done.')
}
