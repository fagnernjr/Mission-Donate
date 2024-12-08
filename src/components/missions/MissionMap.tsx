import { useEffect, useRef } from 'react'
import { Map, Marker } from 'mapbox-gl'
import { Card } from '@/components/ui/card'
import { Mission } from '@/types/mission'

interface MissionMapProps {
  missions: Mission[]
  onMarkerClick?: (mission: Mission) => void
}

export function MissionMap({ missions, onMarkerClick }: MissionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const markers = useRef<Marker[]>([])

  useEffect(() => {
    if (!mapContainer.current) return

    if (!map.current) {
      map.current = new Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-47.9292, -15.7801], // Brasília como centro inicial
        zoom: 4,
      })
    }

    // Limpar marcadores existentes
    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    // Adicionar novos marcadores
    missions.forEach((mission) => {
      const [lng, lat] = mission.location.coordinates

      // Criar elemento personalizado para o marcador
      const el = document.createElement('div')
      el.className = 'mission-marker'
      el.style.backgroundColor = getUrgencyColor(mission.urgency)
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.borderRadius = '50%'
      el.style.border = '2px solid white'
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
      el.style.cursor = 'pointer'

      // Criar popup com informações da missão
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${mission.title}</h3>
          <p class="text-sm text-muted-foreground">${mission.shortDescription}</p>
          <div class="mt-2 text-sm">
            <strong>Meta:</strong> ${formatCurrency(mission.goalAmount)}
          </div>
        </div>
      `)

      // Adicionar marcador ao mapa
      const marker = new Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!)

      marker.getElement().addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(mission)
        }
      })

      markers.current.push(marker)
    })

    // Ajustar o zoom para mostrar todos os marcadores
    if (missions.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      missions.forEach((mission) => {
        bounds.extend(mission.location.coordinates as [number, number])
      })
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }, [missions, onMarkerClick])

  return (
    <div ref={mapContainer} className="h-full w-full">
      <Card className="absolute right-4 top-4 z-10 p-4">
        <h3 className="mb-2 font-semibold">Legenda</h3>
        <div className="space-y-2">
          {['baixa', 'media', 'alta', 'emergencial'].map((urgency) => (
            <div key={urgency} className="flex items-center space-x-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: getUrgencyColor(urgency as Mission['urgency']) }}
              />
              <span className="text-sm capitalize">
                {urgency === 'media' ? 'Média' : urgency}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function getUrgencyColor(urgency: Mission['urgency']): string {
  switch (urgency) {
    case 'baixa':
      return '#22c55e' // verde
    case 'media':
      return '#eab308' // amarelo
    case 'alta':
      return '#f97316' // laranja
    case 'emergencial':
      return '#ef4444' // vermelho
    default:
      return '#94a3b8' // cinza
  }
}
