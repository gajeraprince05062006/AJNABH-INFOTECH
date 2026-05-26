# Deployment Instructions — AJNABH INFOTECH

Follow these steps to deploy the application on **Render** (Backend) and **Netlify** (Frontend) from your GitHub repository.

---

## 1. Backend Deployment on Render

### Step 1: Create a Web Service
1. Log in to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository: `https://github.com/gajeraprince05062006/AJNABH_INFOTECH.git`.

### Step 2: Configure Service Settings
* **Name**: `ajnabh-backend` (or your preferred name)
* **Root Directory**: `server`
* **Language/Runtime**: `Node`
* **Build Command**: `npm install`
* **Start Command**: `node server.js`
* **Plan**: `Free` (or any paid tier)

### Step 3: Add Environment Variables
Click **Advanced** -> **Add Environment Variable** and insert the following values:

| Key | Value / Instructions |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb://ajnabh_infotech:Ajnabh@...` (Your MongoDB Atlas connection URI) |
| `JWT_SECRET` | `aJnAbH_1nf0t3cH_s3cuR3_jWt_k3y_2025_xK9mP2` (Your JWT secret string) |
| `CORS_ORIGIN` | `https://your-netlify-site.netlify.app` (Add your Netlify URL once deployed) |
| `CLOUDINARY_CLOUD_NAME` | `dqhcgivh9` |
| `CLOUDINARY_API_KEY` | `995497448358699` |
| `CLOUDINARY_API_SECRET` | `JiO3wYP08-PNvQvO4epV0_ANG7Y` |
| `RENDER_EXTERNAL_URL` | *Keep this field blank or add your service URL once Render generates it.* |

> [!NOTE]
> **Keep-Alive (Preventing Inactivity Sleeps)**: 
> We integrated an automatic self-pinging loop in `server.js` that checks for `RENDER_EXTERNAL_URL` in the environment. Once your Render service compiles, copy the live URL (e.g. `https://ajnabh-backend.onrender.com`), add it to the environment variables under `RENDER_EXTERNAL_URL`, and redeploy. The server will ping itself every 14 minutes, keeping the container active so it **never sleeps** on the free tier!

---

## 2. Frontend Deployment on Netlify

### Step 1: Create a New Site
1. Log in to [Netlify](https://www.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** and connect your repository: `https://github.com/gajeraprince05062006/AJNABH_INFOTECH.git`.

### Step 2: Configure Build Settings
* **Base directory**: `client`
* **Build command**: `npm run build`
* **Publish directory**: `client/dist`

### Step 3: Add Environment Variables
1. Under **Environment variables**, click **Add a variable**.
2. Add:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://your-render-backend.onrender.com/api` (Replace with your actual Render service URL, ensuring it ends with `/api` and has no trailing slash).

### Step 4: Handle SPA Routing (Netlify Redirects)
Since the React frontend uses client-side routing, we need a redirects rule so page refreshes don't return 404. 
* A `_redirects` file is automatically created inside the dist directory or configured in `netlify.toml`. 
* We have set up the app structure so it builds cleanly. If you encounter routing issues on reload, add a `netlify.toml` file at the root of the project with:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

---

## 3. Post-Deployment Verification
1. Once both services are deployed, update the `CORS_ORIGIN` variable in **Render** to point to your new Netlify address (`https://...netlify.app`) so the backend accepts request origins from your front end.
2. Navigate to your Netlify site URL, test the website loading speed, and sign in to the administration portal (`/admin`) to confirm database operations are functional.
