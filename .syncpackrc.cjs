module.exports = {
    "customTypes": {
        "engines": {
            "path": "engines",
            "strategy": "versionsByName"
        },
        "packageManager": {
            "path": "packageManager",
            "strategy": "name@version"
        }
    },
    "dependencyTypes": ["dev", "prod", "peer"],
    "filter": ".",
    "indent": "  ",
    "semverRange": "",
    "semverGroups": [
        {
            "range": "",
            "label": "apps",
            "dependencyTypes": ["dev", "prod"],
            "dependencies": ["**"],
            "packages": ["*-app"]
        },
        {
            "range": "^",
            "label": "publishable-packages",
            "dependencyTypes": ["peer", "prod"],
            "dependencies": ["**"],
            "packages": ["@httpx/*"]
        },
    ],
    "sortAz": [
        "contributors",
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "resolutions"
    ],
    "sortFirst": ["name", "description", "version", "private", "license", "author", "homepage", "repository", "keywords", "sideEffects", "browserslist", "type", "main", "module", "types", "exports", "typesVersions?", "typesVersions", "files", "resolutions?", "resolutions", "scripts", "workspaces", "engine", "packageManager"],
    "source": ["examples/**", "packages/**", "./package.json"],
    "versionGroups": []
}