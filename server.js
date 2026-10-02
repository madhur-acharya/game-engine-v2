import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeFile, readdir } from 'node:fs/promises';

const app = express();
app.use(express.json({ limit: '50mb' }));
const PORT = 3000;

// ESM __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve index.html at /
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/devtools/tileEditor', (req, res) => {
	res.sendFile(path.join(__dirname, './devtools/tileEditor/index.html'));
});

app.post('/devtools/tileEditor', (req, res) => {
	Promise.all(Object.entries(req.body).map(([key, obj]) => {
		const levelPath= path.join(__dirname, "database/levels", `${key}.json`);
		// const jsonString = JSON.stringify(obj, null, 4);
		const jsonString = JSON.stringify(obj);
		console.log("Saving", jsonString.length, "bytes to", levelPath);
		return writeFile(levelPath, jsonString, 'utf8');
	}))
	.then(() => {
		res.status(201).json({ message: 'Data saved successfully!' });
	})
	.catch(err => {
		return res.status(500).json({ message: 'Failed to save data.', error: err });
	});
});

app.get('/devtools/tileEditor/getlevel/:level', (req, res) => {
	const level = req.params.level;
	const levelPath= path.join(__dirname, "database/levels", `${level}.json`);
	res.sendFile(levelPath, {headers: {"Content-Type": "application/json"}});
});
app.get('/devtools/tileEditor/getlevelindex', (req, res) => {
	const levelPath= path.join(__dirname, "database/levels");
	readdir(levelPath)
	.then(r => res.status(200).json(r))
	.catch(err => res.status(500).json({ message: 'Failed to load level index.', error: err }))
});

// Serve everything statically
app.use(express.static(__dirname));

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
