# Setup

### Fullstack (prod)
`docker-compose up -d --build`<br>
frontend: localhost:3000<br>
backend: localhost:5000<br>

### Frontend (dev)
1. `cd frontend`
2. (first install only) `npm install .`
3. `npm start`<br>
localhost:3000

### Backend (dev/prod)
`docker-compose up -d --build backend`<br>
localhost:5000