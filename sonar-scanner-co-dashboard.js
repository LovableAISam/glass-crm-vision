const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
	{
		serverUrl: 'http://43.218.21.25:9000',
		token: '50c5ad184cbea42b49cbda7207087356b64773ed',
		options: {
			'sonar.projectName': 'Web CO Dashboard',
			'sonar.projectKey': 'web-co-dashboard',
			'sonar.sources': 'apps/co-dashboard/src/packages,apps/co-dashboard/src/pages,apps/co-dashboard/src/shared',
			'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
			'sonar.typescript.tsconfigPath': 'sonar.tsconfig.json'
		},
	},
	() => {}
);