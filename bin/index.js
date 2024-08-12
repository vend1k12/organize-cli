import { Command } from 'commander'
import { generateConfig } from '../lib/generateConfig.js'
import { openProject } from '../lib/openProject.js'

const program = new Command()

program
	.name('project-cli')
	.description('CLI для управления проектами и микросервисами')
	.version('1.0.0')

program
	.command('generate')
	.description('Сгенерировать файл конфигурации для проекта')
	.action(() => {
		generateConfig()
	})

program
	.command('open')
	.description('Открыть проект на основе конфигурационного файла')
	.argument('<config>', 'Путь к конфигурационному файлу')
	.action(config => {
		openProject(config)
	})

program.parse(process.argv)
