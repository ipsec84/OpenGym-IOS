import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Section, Row } from '../components/ui.jsx'
import { MOBILE } from '../lib/mobile.js'
import { t } from '../lib/i18n.js'
import '../admin.css'

export default function AboutApp() {
  const nav = useNavigate()
  const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.3.1'
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  return (
    <div className="view-pad" style={{ paddingBottom: 80, maxWidth: 680, margin: '0 auto' }}>
      <div className="row between" style={{ marginBottom: 16 }}>
        <button className="iconbtn" onClick={() => nav('/settings')} aria-label="Volver">
          <Icon name="chevronLeft" />
        </button>
        <div style={{ flex: 1, marginLeft: 12 }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Información del Sistema</h1>
          <div className="sub">openGym v{appVersion} · Personalizaciones Alberto GM</div>
        </div>
      </div>

      {/* Tarjeta de Estado y Versión */}
      <div className="card" style={{ borderColor: 'var(--acc)', marginBottom: 16 }}>
        <div className="row" style={{ gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--acc)', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22
          }}>
            <Icon name="dumbbell" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>openGym (Custom Build)</div>
            <div className="dim small">Versión {appVersion} · Compilación {MOBILE ? 'iOS Nativa (Capacitor)' : isStandalone ? 'PWA Instalada' : 'Web Self-Hosted'}</div>
          </div>
        </div>

        <div className="tiles" style={{ marginTop: 14 }}>
          <div className="tile">
            <div className="l">Modo Ejecución</div>
            <div className="v" style={{ fontSize: '.9rem', color: 'var(--acc)' }}>
              {MOBILE ? 'App iOS' : isStandalone ? 'PWA' : 'Navegador Web'}
            </div>
          </div>
          <div className="tile">
            <div className="l">Servidor Backend</div>
            <div className="v" style={{ fontSize: '.75rem', wordBreak: 'break-all' }}>
              gym.albertogm.uk
            </div>
          </div>
          <div className="tile">
            <div className="l">Alojamiento</div>
            <div className="v" style={{ fontSize: '.85rem' }}>
              Synology NAS
            </div>
          </div>
          <div className="tile">
            <div className="l">Conexión</div>
            <div className="v" style={{ fontSize: '.85rem', color: 'var(--green)' }}>
              Cloudflare Tunnel
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Modificaciones */}
      <Section title="Modificaciones y Optimizaciones Aplicadas">
        <Row
          icon="sparkles"
          iconTint="var(--blue)"
          title="Soporte iOS Nativo & Capacitor 7"
          subtitle="Generación de IPA (uk.albertogm.opengym), compatibilidad con iOS 16/17/18 y pipeline CI/CD en GitHub Actions."
        />
        <Row
          icon="link"
          iconTint="var(--acc)"
          title="Emparejamiento Móvil Seguro"
          subtitle="Autenticación móvil por código temporal y token Bearer (/api/pair/*), evitando las limitaciones de WebAuthn en WebView."
        />
        <Row
          icon="shield"
          iconTint="var(--green)"
          title="Optimización para Synology NAS (Docker)"
          subtitle="Dockerfile adaptado sin $BUILDPLATFORM para evitar errores en DSM. Imágenes locales opengym-api y opengym-web."
        />
        <Row
          icon="bolt"
          iconTint="var(--yellow)"
          title="Corrección de Service Worker (sw.js)"
          subtitle="Solución al error 'Response body is already used' mediante clonación síncrona de respuestas antes de la caché."
        />
        <Row
          icon="globe"
          iconTint="var(--indigo)"
          title="Túnel Seguro Cloudflare Zero Trust"
          subtitle="Acceso HTTPS seguro sin apertura de puertos en el router y preservación de cabecera CF-Connecting-IP."
        />
        <Row
          icon="calendar"
          iconTint="var(--purple)"
          title="Rutinas para Principiantes (3, 4 y 5 Días)"
          subtitle="Planes completos estructurados para principiantes: Full Body (3 días), Torso/Pierna (4 días) e Híbrida PPL (5 días)."
        />
        <Row
          icon="dumbbell"
          iconTint="var(--acc)"
          title="Catálogo de Ejercicios en Español"
          subtitle="1.324 ejercicios traducidos con la terminología correcta y estándar de gimnasio en español."
        />
      </Section>

      {/* Repositorio y Créditos */}
      <Section title="Código Fuente y Licencia">
        <Row
          icon="gear"
          iconTint="var(--grey)"
          title="Repositorio Privado"
          subtitle="github.com/ipsec84/OpenGym-IOS"
        />
        <Row
          icon="info"
          iconTint="var(--grey)"
          title="Software Base Original"
          subtitle="openGym por Duarte Santos (Licencia AGPL-3.0-or-later)"
        />
      </Section>

      <div className="dim small" style={{ textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
        openGym v{appVersion} · Build específico para Alberto GM<br />
        Datos almacenados de forma privada en tu propio servidor NAS.
      </div>
    </div>
  )
}