#!/usr/bin/env node
import { exec } from 'child_process'
import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'

const program = new Command()
const globalConfigDir = path.join(process.env.HOME, '.config', 'organize-cli')
fs.ensureDirSync(globalConfigDir)

function getDirectories(srcPath) {
	return fs
		.readdirSync(srcPath)
		.map(name => path.join(srcPath, name))
		.filter(path => fs.statSync(path).isDirectory())
}

function openInVSCode(projectPath) {
	exec(`code ${projectPath}`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error opening VS Code: ${stderr}`)
		} else {
			console.log(`VS Code opened for ${projectPath}`)
		}
	})
}

function openTerminal(projectPath) {
	exec(
		`alacritty --working-directory=${projectPath}`,
		(error, stdout, stderr) => {
			if (error) {
				console.error(`Error opening terminal: ${stderr}`)
			} else {
				console.log(`Terminal opened for ${projectPath}`)
			}
		}
	)
}

program
	.name('organize-cli')
	.description('CLI for managing projects')
	.version('0.0.1')

program
	.command('generate')
	.description('Generate a global configuration file')
	.option('-n, --name <name>', 'Name of the configuration', 'default-config')
	.action(async options => {
		const configName = options.name
		const configPath = path.join(globalConfigDir, `${configName}.json`)

		// Get all directories in the current working directory
		const directories = getDirectories(process.cwd())

		const config = {
			projects: directories.map(dir => ({
				name: path.basename(dir),
				path: path.relative(process.cwd(), dir),
				terminals: [], // Populate this with any terminal-specific info if needed
			})),
		}

		await fs.writeJson(configPath, config, { spaces: 2 })
		console.log(`Global configuration file created at ${configPath}`)
	})

program
	.command('open <name>')
	.description('Open a project configuration by name')
	.action(async name => {
		const configPath = path.join(globalConfigDir, `${name}.json`)
		if (!fs.existsSync(configPath)) {
			console.error(`Configuration file ${name} does not exist.`)
			process.exit(1)
		}

		const config = await fs.readJson(configPath)

		config.projects.forEach(project => {
			const fullPath = path.resolve(process.cwd(), project.path)

			// Open VS Code with the project path
			openInVSCode(fullPath)

			// Open a terminal at the project path
			openTerminal(fullPath)
		})
	})

program.parse(process.argv)
