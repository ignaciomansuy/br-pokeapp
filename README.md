## Running the server

### Node 

Required Node version >= 18.17.0

```bash
npm i && npm run dev
```

### Docker

```bash
docker build -t br-pokeapp .
docker run -p 3000:3000 br-pokeapp
```

Open [http://localhost:3000](http://localhost:3000) to search for pokemons.
