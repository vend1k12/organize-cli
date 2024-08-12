import { exec } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

export function openProject(configFilePath) {
	const configPath = path.resolve(process.cwd(), configFilePath)
	const config = fs.readJsonSync(configPath)

	console.log(`Открываем проект ${config.name}`)

	config.services.forEach(service => {
		console.log(`Открытие ${service.name} по пути ${service.path}`)
		exec(`code ${service.path}`)
		exec(`alacritty --working-directory ${service.path}`)
	})
}
