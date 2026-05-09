[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xsUuW6PJ)

# Template

Template para proyectos monorepo con **Nextjs**, **Express**, **MongoDB** y **Docker**.

## 📚 Documentación

- **Backend:** Para información completa sobre la API de backend, consulta la [documentación completa del backend](./backend/src/README.md).
- **Frontend:** Para información sobre cómo lanzar y usar el frontend, consulta la [documentación del frontend](./frontend/README.md).

---

## 2.1. Descripció del projecte

Aquesta és una plataforma de visualització i administració de vols programats. L'aplicació està dirigida a dos tipus d'usuaris:

- **Usuaris públics (Passatgers):** Poden entrar a la web lliurement per veure l'estat del servidor, consultar el llistat complet de vols, filtrar per origen/destí/ID i veure els detalls específics de cada vol.
- **Administradors (Usuaris autenticats):** Poden fer el mateix però, en iniciar sessió, poden editar la informació dels vols o esborrar-los.

## 2.2. Com executar en local

### Requisits previs

- Node.js
- pnpm
- Docker

### Instal·lació i Configuració

1. **Clonar el repositori:**

   ```bash
   git clone <url-del-repositorio>
   cd <nom-de-la-carpeta>
   ```

2. **Variables d'entorn:**
   Crea els arxius `.env.local` a les respectives carpetes guiant-te pels exemples.

   **Frontend (`frontend/.env.local`):**

   ```env
   # Per a Server Components (dins de Docker)
   API_BASE_URL=http://host.docker.internal:4000/api/v1

   # Per a Client Components (Navegador)
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
   ```

   **Backend (`backend/.env`):**
   _(Assegura't de configurar els paràmetres de MongoDB i el JWT_SECRET segons indiqui el README del backend)._

3. **Arrencar en desenvolupament (Docker):**
   Des de l'arrel del projecte, executa:

   ```bash
   docker-compose up --build
   ```

   _L'aplicació estarà disponible a `http://localhost:3000` i l'API a `http://localhost:4000`._

---

## 2.3. Vídeo de demostració

**[Enllaç](enllaç)**

---

## 2.4. Ús d'IA

En el desenvolupament d'aquesta pràctica s'ha utilitzat l'IA (en concret _Gemini_ i _Copilot_ de _GitHub_) amb els propòsits següents: millorar la comprensió de conceptes, amb especial indagació en els _Hooks_ de React. Comprensió d'errors i suggeriments de solució, com falses adreces d'API o confusió entre enllaç dins de docker i localhost.

**Revisió i adaptació:** Tot el codi suggerit ha estat revisat, adaptat als esquemes de validació reals del backend (ex. comprovant `Joi schemas` del codi en lloc de la documentació) i estructurat en petits commits atòmics per garantir el seu funcionament correcte.
