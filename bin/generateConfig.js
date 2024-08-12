import fs from 'fs-extra'
import path from 'path'

export function generateConfig() {
	const exampleConfig = {
		name: 'aqua-invest',
		services: [
			{ name: 'server', path: '~/projects/aqua-invest/aqua-invest-server' },
			{ name: 'admin', path: '~/projects/aqua-invest/aqua-invest-admin' },
			{ name: 'client', path: '~/projects/aqua-invest/aqua-invest-client' },
		],
	}

	const configPath = path.resolve(
		process.cwd(),
		'configs',
		`${exampleConfig.name}.json`
	)

	fs.ensureDirSync(path.dirname(configPath))
	fs.writeJsonSync(configPath, exampleConfig, { spaces: 2 })

	console.log(`Конфигурационный файл создан: ${configPath}`)
}
