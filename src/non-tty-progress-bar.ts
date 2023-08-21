import { IProgressBar } from './types'

export class NonTTYProgressBar implements IProgressBar {
	private _total: number = 0
	
	public start(options: { total: number; }) {
		this._total = options.total
	}
	public stop(message: string) {
		console.log(message)
	}
	public update(options: { value: number; }) {
		console.log(`Progress: ${options.value}/${this._total}`)
	}
	
}
