export interface IReport {
	projectName: string
	cycles: string[][]
	subCycles: {
		cycle: string[]
		occurrences: number
	}[]
	unusedFiles: string[]
}


export interface IProgressBar {
	start: (options: { total: number }) => void
	stop: (message: string) => void
	update: (options: { value: number }) => void
}
