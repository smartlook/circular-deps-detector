import { SourceFile, SyntaxKind } from 'ts-morph'

import { isDefined } from './utils'
import { GlobalContext } from './global-context'

export function processFile(filePath: string) {
	const sourceFile = GlobalContext.project?.getSourceFile(filePath)
	if (!sourceFile) {
		return
	}

	// If we've already visited this file and it's on the stack, we've found a cycle.
	if (GlobalContext.visitedPaths.includes(filePath)) {
		if (GlobalContext.currentStack.has(filePath)) {
			const currentStackIndex = GlobalContext.currentStack.getValues().indexOf(filePath)
			const cycle = GlobalContext.currentStack.getValues().slice(currentStackIndex)
			GlobalContext.cycles.push(cycle)
			return
		}
		return
	}

	GlobalContext.progressBar.update({ value: GlobalContext.visitedPaths.length })

	// Mark this file as visited and add it to the stack.
	GlobalContext.visitedPaths.push(filePath)
	GlobalContext.currentStack.push(filePath)

	// Recursively process all referenced files.
	const paths = findReferencedPaths(sourceFile)
	paths.forEach((path) => {
		processFile(path)
	})

	// Remove this file from the stack.
	GlobalContext.currentStack.pop()

	return
}

function findReferencedPaths(sourceFile: SourceFile) {
	// Get all import and export declarations.
	const importDeclarations = sourceFile.getImportDeclarations()
	const exportDeclarations = sourceFile.getExportDeclarations()
	const dynamicImportDeclarations = getDynamicImportDeclarations(sourceFile)
	const declarations = [...importDeclarations, ...exportDeclarations, ...dynamicImportDeclarations]

	const paths = declarations
		.map((x) => x.getModuleSpecifierSourceFile()?.getFilePath())
		.filter(isDefined)
		.filter((x) => x.includes(GlobalContext.config.rootDir))

	return paths
}

// EXAMPLE:
// const EventsPickerHandler = lazy(
//   () => import('./components/EventsPickerHandler' /* webpackChunkName: "events-picker-handler" */),
// 	 { finishAppLoader: true },
// )
function getDynamicImportDeclarations(sourceFile: SourceFile) {
	const dynamicImportPaths: string[] = []

	const variableStatements = sourceFile.getVariableStatements()
	variableStatements.forEach((variableStatement) => {
		const declarationList = variableStatement.getDeclarationList()
		declarationList.forEachChild((declaration) => {
			const callExpressions = declaration.getDescendantsOfKind(SyntaxKind.CallExpression)
			callExpressions.forEach((callExpression) => {
				const identifiers = callExpression.getDescendantsOfKind(SyntaxKind.Identifier)
				const isLazyCallExpression = identifiers.some((identifier) => identifier.getText() === 'lazy')
				if (!isLazyCallExpression) {
					return
				}
				const args = callExpression.getArguments()
				args.forEach((arg) => {
					const stringLiterals = arg.getDescendantsOfKind(SyntaxKind.StringLiteral)
					stringLiterals.forEach((literal) => {
						const path = literal.getLiteralText()
						dynamicImportPaths.push(path)
					})
				})
			})
		})
	})

	const declarations = dynamicImportPaths.map((path, index) => ({
		defaultImport: `tmp_import_${index}`,
		moduleSpecifier: path,
	}))

	const importDeclarations = sourceFile.addImportDeclarations(declarations)

	return importDeclarations
}
