const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
	{
		serverUrl: 'http://43.218.21.25:9000',
		token: 'a9b999cace92107b1ee11f92f4d6ad941f2ed6bd',
		options: {
			'sonar.projectName': 'Web Principal Dashboard',
			'sonar.projectKey': 'web-principal-dashboard',
			'sonar.sources': 'apps/principal-dashboard/src/packages,apps/principal-dashboard/src/pages,apps/principal-dashboard/src/shared',
			'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
			'sonar.typescript.tsconfigPath': 'sonar.tsconfig.json'
		},
	},
	() => {}
);