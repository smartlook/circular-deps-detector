export class Stack<T = string> {
	private readonly items: T[] = []

	push(item: T) {
		this.items.push(item)
	}

	pop(): T | undefined {
		return this.items.pop()
	}

	peek(): T | undefined {
		return this.items[this.items.length - 1]
	}

	isEmpty(): boolean {
		return this.items.length === 0
	}

	has(item: T): boolean {
		return this.items.includes(item)
	}

	getValues(): T[] {
		return this.items
	}
}
