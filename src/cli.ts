import { exitWithError } from './utils'

export function checkCliArgs() {
	if (process.argv.length < 4) {
		return exitWithError('Missing CLI arguments.', true)
	}

	const [, , option, configPath] = process.argv

	if (option !== '--config') {
		return exitWithError('Missing CLI option "--config".', true)
	}

	if (!configPath) {
		return exitWithError('Missing CLI argument "<configPath>".', true)
	}

	return { configPath }
}
