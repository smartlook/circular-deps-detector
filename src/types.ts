export interface IReport {
	projectName: string
	cycles: string[][]
	subCycles: {
		cycle: string[]
		occurrences: number
	}[]
	unusedFiles: string[]
}
