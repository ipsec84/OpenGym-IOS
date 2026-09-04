# Guía: Compilación en Xcode Cloud y TestFlight para openGym iOS

Tu repositorio **ipsec84/OpenGym-IOS** ya está subido y configurado con:
- **Bundle Identifier:** `uk.albertogm.opengym`
- **Nombre de la app:** `openGym`
- **Capacitor 7** con soporte iOS (`frontend/ios`)
- **Scripts de Xcode Cloud:** `ci_scripts/ci_post_clone.sh` para instalar Node.js, compilar los assets web y ejecutar `pod install` automáticamente en los servidores de Apple.

---

## Paso 1: Configurar la App en App Store Connect (100% web, sin Mac)

1. Entra en [App Store Connect](https://appstoreconnect.apple.com/) con tu cuenta de Apple Developer.
2. Ve a **Mis apps** y pulsa el botón **(+)** -> **Nueva app**.
3. Rellena los campos:
   - **Plataforma:** iOS
   - **Nombre:** openGym (o el nombre que prefieras si ya está cogido)
   - **Idioma principal:** Español o Inglés
   - **Bundle ID:** Selecciona o registra `uk.albertogm.opengym`
   - **SKU:** `opengym-ios-01` (un identificador interno cualquiera)
   - **Acceso:** Acceso completo
4. Pulsa **Crear**.

---

## Paso 2: Conectar Xcode Cloud con tu GitHub

1. Dentro de tu app en App Store Connect, ve a la pestaña **Xcode Cloud** (en la barra superior de la app).
2. Pulsa en **Empezar** o **Crear flujo de trabajo (Workflow)**.
3. Conecta tu cuenta de **GitHub** cuando te lo pida y autoriza el acceso a tu repositorio privado `ipsec84/OpenGym-IOS`.
4. Configuración del Workflow en Xcode Cloud:
   - **Proyecto:** `frontend/ios/App/App.xcworkspace`
   - **Rama principal:** `main`
   - **Acciones:**
     - **Build:** iOS App
     - **TestFlight:** Activar distribución interna a tu grupo de pruebas (para que en cuanto compile te llegue al iPhone).
5. Xcode Cloud detectará automáticamente el archivo `ci_scripts/ci_post_clone.sh`, instalará las dependencias necesarias (`node`, `cocoapods`), compilará el código y subirá la `.ipa` a **TestFlight**.

---

## Paso 3: Conectar la App al servidor (`gym.albertogm.uk`)

Una vez que instales openGym desde TestFlight en tu iPhone:

1. Entra a tu servidor en Safari/Chrome: `https://gym.albertogm.uk`.
2. Inicia sesión con tu **Passkey**.
3. Ve a **Settings (Ajustes)** -> **"Pair the mobile app"** (Emparejar app móvil).
   - Te mostrará un código de 6 dígitos / unívoco temporal (válido por 5 minutos).
4. Abre la app **openGym** en tu iPhone:
   - En la pantalla de bienvenida (o en Ajustes dentro de la app), pulsa **"Connect to my server"**.
   - Introduce la URL: `https://gym.albertogm.uk`.
   - Introduce el código generado en el paso 3.
5. ¡Listo! La app quedará vinculada permanentemente con tu servidor Synology a través de Cloudflare Tunnel sin necesidad de volver a introducir Passkey ni contraseñas.

---

## Respaldo local
Tienes una copia completa del proyecto comprimida en:
`OpenGym-IOS-Project.zip` dentro de esta carpeta.