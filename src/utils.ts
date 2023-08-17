import { IReport } from './types'

export function exitWithError(message: string, printUsage = false) {
	console.error(message)
	if (printUsage) {
		console.log('Usage: detect-circular-deps --config <configPath>')
	}
	return process.exit(1)
}

export function processReport(report: IReport): IReport {
	report.cycles = report.cycles.map((cycle) => cycle.map((path) => path.replace(process.cwd(), '.')))
	report.subCycles = report.subCycles.map((subCycle) => ({
		cycle: subCycle.cycle.map((path) => path.replace(process.cwd(), '.')),
		occurrences: subCycle.occurrences,
	}))
	report.unusedFiles = report.unusedFiles.map((path) => path.replace(process.cwd(), '.'))
	return report
}

export function isDefined<T>(x: T | undefined): x is T {
	return x !== undefined
}

export function findSubCycles(cycles: string[][]) {
	const subCycles = cycles.filter((x, index_x) =>
		cycles.find((y, index_y) => index_x !== index_y && containsSubarray(y, x)),
	)
	const uniqueSubCycles = subCycles.filter((x) => {
		const isUnique = subCycles.every((y) => x === y || !containsSubarray(x, y))
		return isUnique
	})
	return uniqueSubCycles.map((x) => {
		const occurrences = cycles.filter((y) => x !== y && containsSubarray(y, x)).length
		return { cycle: x, occurrences }
	})
}

export function containsSubarray(array: string[], subarray: string[]) {
	if (subarray.length > array.length) {
		return false
	}

	for (let i = 0; i < array.length - subarray.length + 1; i++) {
		const subarrayStart = array[i]
		const subarrayEnd = array[i + subarray.length - 1]
		if (subarrayStart !== subarray[0] || subarrayEnd !== subarray[subarray.length - 1]) {
			continue
		}

		let contains = true
		for (let j = 0; j < subarray.length; j++) {
			if (array[i + j] !== subarray[j]) {
				contains = false
				break
			}
		}
		if (contains) {
			return true
		}
	}

	return false
}
