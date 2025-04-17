# Overflow

## Gestión de Órdenes

---

### Backend: Proyecto Laravel con Passport


**Instrucciones de Instalación y Configuración:**

1.  **Clonar el repositorio (si aplica):**
    ```bash
    git clone https://github.com/jordysantamaria94/OrderFlow.git
    cd OverFlow
    ```

2.  **Instalar las dependencias de Composer:**
    ```bash
    composer install
    ```

3.  **Copiar el archivo de entorno (.env):**
    ```bash
    cp .env.example .env
    ```

4.  **Instalar Passport:**
    ```bash
    php artisan install:api --passport
    ```

5.  **Configurar la base de datos en el archivo `.env`:**
    Asegúrate de completar las siguientes variables con la información de tu base de datos:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=<nombre_de_la_base_de_datos>
    DB_USERNAME=<usuario_de_la_base_de_datos>
    DB_PASSWORD=<contraseña_de_la_base_de_datos>
    ```

6.  **Ejecutar las migraciones para crear las tablas en la base de datos:**
    ```bash
    php artisan migrate
    ```
    (El flag `--seed` opcionalmente ejecutará los seeders para poblar la base de datos con datos iniciales).

7.  **Instalar y configurar Laravel Passport:**
    ```bash
    composer require laravel/passport
    ```

8.  **Ejecutar las migraciones de Passport:**
    ```bash
    php artisan migrate
    ```

9. **Ejecutar el servidor de desarrollo de Laravel:**
    ```bash
    php artisan serve
    ```
    Esto iniciará el servidor en `http://127.0.0.1:8000`.

---

### Frontend: Proyecto Next.js

**Prerequisites:**

* Node.js (versión recomendada según la documentación de Next.js)
* npm o yarn (Administradores de paquetes de Node.js)

**Instrucciones de Instalación y Configuración:**

1.  **Instalar las dependencias:**
    Con npm:
    ```bash
    npm install
    ```
    O con yarn:
    ```bash
    yarn install
    ```

4.  **Ejecutar el servidor de desarrollo de Next.js:**
    Con npm:
    ```bash
    npm run dev
    ```
    O con yarn:
    ```bash
    yarn dev
    ```
