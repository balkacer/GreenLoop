# GreenLoop (monorepo demo)

App móvil **React Native Bare** + mini backend **Express** para probar de punta a punta el flujo de GreenPoints, referidos, mapa de contenedores, QR/deposito simulado, canjes y donaciones.

## Requisitos

- Node.js ≥ 22
- Para Android: Android Studio / SDK, emulador o dispositivo USB
- Para iOS (solo macOS): Xcode, CocoaPods

## Estructura

```
GreenLoop/
├── backend/          # API REST mock en memoria (Express + TS)
├── lgo/              # Logos fuente (SVG): símbolo verde recomendado para marca / icono
├── mobile/           # App React Native 0.85 + TS
├── package.json      # Scripts que disparan backend/mobile
└── README.md
```

Los SVG de `lgo/` se copian a `mobile/src/assets/brand/` para importarlos en la app con `react-native-svg` + `react-native-svg-transformer`. El componente `GreenLoopLogo` usa por defecto **`logo_green_loop_symbol_green`**. En Android (API 26+) el launcher usa el mismo símbolo como **icono adaptativo** (`ic_launcher_foreground.xml`). En iOS, sustituye los PNG en `AppIcon.appiconset` exportando desde el SVG en Xcode o tu herramienta de diseño.

### App (`mobile/src`)

- `app/` — navegación, providers, stores Redux + Zustand
- `api/greenloopApi.ts` — RTK Query (todas las rutas REST)
- `features/` — pantallas por dominio (auth, dashboard, deposit, etc.)
- `shared/` — UI reutilizable, tema, utilidades, servicios (`biometrics`, `location`, `maps`, `mockBle`, `sharing`, `storage`)
- `shared/constants/pointsRules.ts` + `shared/services/pointsCalculator.ts` — motor de GreenPoints por depósito (reglas configurables; mismo criterio que el backend mock)

### Motor de puntos por depósito

Fórmula: `redondeo(base volumen × material × calidad × evento) + bonos planos`, con mínimo **1 GP** en la parte multiplicativa. Rangos de volumen, multiplicadores y bonos están en `pointsRules.ts`. Los tests unitarios viven en `mobile/src/shared/services/__tests__/pointsCalculator.test.ts`.

**POST `/containers/:id/complete-deposit`** (body JSON):

```json
{
  "depositSessionId": "…",
  "volumeRange": "medium",
  "estimatedWeightKg": 1.4,
  "materialType": "plastic_pet",
  "materialQuality": "clean",
  "isEventActive": false,
  "bonuses": ["first_deposit"]
}
```

Respuesta incluye `transactionId`, `pointsEarned`, `newBalance` y `calculation` (desglose). Si el usuario ya tenía un depósito exitoso previo, el servidor **omite** `first_deposit` aunque el cliente lo envíe.

El mock BLE (`mockBle.ts`) devuelve escenarios desde `depositMockScenarios.ts` según el `containerId`. La pantalla **Depósito completado** muestra el desglose devuelto por el API.

## Variables de entorno

### Backend (`backend/.env`)

Copia `backend/.env.example` a `backend/.env`.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto HTTP | `4000` |
| `JWT_SECRET` | Firma access token | cadena larga aleatoria |
| `JWT_REFRESH_SECRET` | Firma refresh token | otra cadena |
| `REFERRAL_BONUS_POINTS` | Puntos para quien refiere al registrar un nuevo usuario | `250` |
| `CORS_ORIGIN` | Origen CORS (`*` en dev) | `*` |

### Mobile

La URL del API en desarrollo está en `mobile/src/shared/constants/config.ts`:

- **Android emulator**: `http://10.0.2.2:4000` (mapea al host donde corre el backend).
- **iOS simulator**: `http://localhost:4000`.

Dispositivo físico: cambia la IP por la LAN de tu PC (ej. `http://192.168.1.x:4000`).

**Google Maps (Android):** sustituye `REPLACE_WITH_GOOGLE_MAPS_API_KEY` en `mobile/android/app/src/main/res/values/strings.xml` por tu API key de Maps SDK for Android. Sin key válida el mapa puede verse vacío.

## Cómo ejecutar

Terminal 1 — API:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Terminal 2 — Metro:

```bash
cd mobile
npm start
```

Terminal 3 — Android:

```bash
cd mobile
npx react-native run-android
```

Desde la raíz del repo también puedes usar:

```bash
npm run backend
npm run mobile
npm run mobile:android
```

## Demo rápida

- Backend incluye usuario **demo@greenloop.do** / **demo1234** (también usuario `demo_greenloop`).
- Flujo sugerido: onboarding → login demo → Inicio → escanear QR manual `c1` → depósito simulado → revisar pestaña Puntos.

## Arquitectura resumida

| Capa | Rol |
|------|-----|
| **RTK Query** | Llamadas HTTP, cache, tags de invalidación |
| **Zustand + persist (AsyncStorage)** | Sesión JWT, flags UI (onboarding, biometría) |
| **Servicios** | Encapsulan BLE mock, ubicación, mapas externos, compartir, Keychain/biometría |

OAuth Google/Apple y passkeys están como **placeholders** en UI y mensajes; el backend formal los reemplazará.

## Notas

- El backend es **volátil** (memoria): al reiniciar el proceso se pierden usuarios nuevos; los datos seed se recargan.
- Bluetooth real no está conectado: `mockBle.ts` simula pasos hasta integrar BLE real detrás de la misma interfaz.
