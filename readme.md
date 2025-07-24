# Spring Boot CRUD API Deployment to Azure Container Instances (ACI) via Azure DevOps

## 🌟 Project Overview

This project demonstrates how to develop and deploy a Java Spring Boot CRUD web application using Azure Container Instances (ACI) and automate the CI/CD pipeline using Azure DevOps.
[Watch the demo video](https://github.com/yesiamkriti/celebal-final-assignment/blob/main/frontend/Untitled%20video%20-%20Made%20with%20Clipchamp.mp4)
<video src="https://github.com/yesiamkriti/celebal-final-assignment/blob/main/frontend/Untitled%20video%20-%20Made%20with%20Clipchamp.mp4" width="600" controls></video>

---

## 📄 Project Components

### 1. **Backend (Spring Boot)**

- CRUD API for managing users
- Exposed endpoints:

  - `GET /users`
  - `POST /users`
  - `PUT /users/{id}`
  - `DELETE /users/{id}`
  - `GET /` (health endpoint)

### 2. **Database (MySQL)**

- Runs as a separate container
- Stores `user` data persistently (optional volume mount)

### 3. **Frontend (HTML + JS)**

- Simple Bootstrap-based UI for interacting with the CRUD API

### 4. **Docker & Azure Setup**

- Dockerfile for Spring Boot backend
- Docker Compose used for local development
- MySQL image pushed once to Azure Container Registry (ACR)

### 5. **CI/CD Pipeline**

- Uses Azure DevOps to:

  - Build and push Spring Boot Docker image
  - Deploy MySQL and API container to ACI

---

## ⚙️ Tools & Services Used

- **Spring Boot**
- **MySQL** (from Docker image or ACR)
- **Azure DevOps**
- **Azure Container Instances (ACI)**
- **Azure Container Registry (ACR)**

---

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── Dockerfile
│   ├── src/main/java/... (Spring Boot code)
│   └── pom.xml
├── frontend/
│   ├── index.html
│   └── scripts.js
├── docker-compose.yml (for local dev)
├── azure-pipelines.yml (CI/CD pipeline)
```

---

## 🚀 Azure Pipeline Overview

### **Variables**

```yaml
acrName: api4acr
acrLoginServer: api4acr.azurecr.io
resourceGroup: apirg
appImageName: apispringbootapp
appImageTag: v1
```

### **Build & Push Spring Boot App**

```yaml
- task: Docker@2
  inputs:
    containerRegistry: 'scn4api'
    repository: '$(appImageName)'
    command: 'buildAndPush'
    Dockerfile: 'backend/Dockerfile'
    tags: |
      $(appImageTag)
```

### **Deploy to ACI**

```yaml
az container create \
--resource-group $(resourceGroup) \
--name mysql-container \
--image $(acrLoginServer)/mysql:8.0 \
--environment-variables MYSQL_ROOT_PASSWORD=root MYSQL_DATABASE=userdb \
--dns-name-label mysql4api \
--os-type Linux --cpu 1 --memory 1.5 \
--registry-login-server $(acrLoginServer) \
--registry-username $(ACR_USERNAME) \
--registry-password $(ACR_PASSWORD)

sleep 40

az container create \
--resource-group $(resourceGroup) \
--name springboot-api \
--image $(acrLoginServer)/$(appImageName):$(appImageTag) \
--dns-name-label springboot4api \
--ports 8080 \
--os-type Linux --cpu 1 --memory 1.5 \
--environment-variables \
SPRING_DATASOURCE_URL=jdbc:mysql://mysql4api.eastus.azurecontainer.io:3306/userdb \
SPRING_DATASOURCE_USERNAME=root \
SPRING_DATASOURCE_PASSWORD=root \
--registry-login-server $(acrLoginServer) \
--registry-username $(ACR_USERNAME) \
--registry-password $(ACR_PASSWORD)
```

---

## 🚫 Common Issues & Fixes

### ❌ ERR_SSL_PROTOCOL_ERROR

- ACI only supports HTTP
- Use: `http://springboot4api.eastus.azurecontainer.io:8080`

### ❌ Invalid character in HTTP request

- Caused by using `https://` instead of `http://`

### ⚡ Slow deployments

- Use Docker cache layers
- Use Azure DevOps cache for Maven dependencies
- Only build Spring Boot image, not MySQL

---

## 📈 How to Access

- API endpoint: `http://springboot4api.eastus.azurecontainer.io:8080/users`
- MySQL: `mysql4api.eastus.azurecontainer.io:3306` (internal use)

---

## 💼 Author

Kriti — Full Stack Developer | DevOps Enthusiast
