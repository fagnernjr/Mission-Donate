import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Filter, SlidersHorizontal } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MissionMap } from './MissionMap'
import {
  Mission,
  MissionType,
  MissionUrgency,
  MissionFilters,
  MissionSortOptions,
} from '@/types/mission'
import { formatCurrency } from '@/lib/utils'

const missionTypes: { value: MissionType; label: string }[] = [
  { value: 'evangelismo', label: 'Evangelismo' },
  { value: 'assistencial', label: 'Assistencial' },
  { value: 'educacional', label: 'Educacional' },
  { value: 'saude', label: 'Saúde' },
  { value: 'construcao', label: 'Construção' },
  { value: 'traducao', label: 'Tradução' },
]

const urgencyLevels: { value: MissionUrgency; label: string }[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'emergencial', label: 'Emergencial' },
]

interface MissionCardProps {
  mission: Mission
}

function MissionCard({ mission }: MissionCardProps) {
  const router = useRouter()
  const progress = (mission.currentAmount / mission.goalAmount) * 100

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{mission.title}</CardTitle>
          <Badge
            variant={
              mission.urgency === 'emergencial'
                ? 'destructive'
                : mission.urgency === 'alta'
                ? 'default'
                : 'secondary'
            }
          >
            {urgencyLevels.find((u) => u.value === mission.urgency)?.label}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {mission.location.city}, {mission.location.state}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {mission.shortDescription}
        </p>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(mission.currentAmount)}</span>
            <span className="text-muted-foreground">
              {formatCurrency(mission.goalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => router.push(`/missions/${mission.id}`)}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  )
}

interface FiltersSheetProps {
  filters: MissionFilters
  onFiltersChange: (filters: MissionFilters) => void
}

function FiltersSheet({ filters, onFiltersChange }: FiltersSheetProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleChange = (key: keyof MissionFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Refine sua busca por missões usando os filtros abaixo
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Missão</label>
            <Select
              value={localFilters.missionType}
              onValueChange={(value) =>
                handleChange('missionType', value as MissionType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {missionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Urgência</label>
            <Select
              value={localFilters.urgency}
              onValueChange={(value) =>
                handleChange('urgency', value as MissionUrgency)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a urgência" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Valor Necessário</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Mínimo"
                value={localFilters.minAmount}
                onChange={(e) =>
                  handleChange('minAmount', parseInt(e.target.value))
                }
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Máximo"
                value={localFilters.maxAmount}
                onChange={(e) =>
                  handleChange('maxAmount', parseInt(e.target.value))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Apenas Destacadas</label>
            <Switch
              checked={localFilters.featured}
              onCheckedChange={(checked) => handleChange('featured', checked)}
            />
          </div>

          <Button className="w-full" onClick={handleApply}>
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface SortingMenuProps {
  sortOptions: MissionSortOptions
  onSortChange: (options: MissionSortOptions) => void
}

function SortingMenu({ sortOptions, onSortChange }: SortingMenuProps) {
  return (
    <div className="flex items-center space-x-2">
      <Select
        value={sortOptions.field}
        onValueChange={(value) =>
          onSortChange({
            ...sortOptions,
            field: value as MissionSortOptions['field'],
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="urgency">Urgência</SelectItem>
          <SelectItem value="currentAmount">Valor Arrecadado</SelectItem>
          <SelectItem value="endDate">Data de Término</SelectItem>
          <SelectItem value="donationVelocity">Velocidade de Doações</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          onSortChange({
            ...sortOptions,
            direction: sortOptions.direction === 'asc' ? 'desc' : 'asc',
          })
        }
      >
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function MissionDiscovery() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [filters, setFilters] = useState<MissionFilters>({})
  const [sortOptions, setSortOptions] = useState<MissionSortOptions>({
    field: 'urgency',
    direction: 'desc',
  })
  const [view, setView] = useState<'grid' | 'map'>('grid')

  useEffect(() => {
    // TODO: Implementar chamada à API para buscar missões com filtros e ordenação
  }, [filters, sortOptions])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Descobrir Missões</h1>
        <div className="flex items-center space-x-4">
          <FiltersSheet filters={filters} onFiltersChange={setFilters} />
          <SortingMenu
            sortOptions={sortOptions}
            onSortChange={setSortOptions}
          />
          <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'map')}>
            <TabsList>
              <TabsTrigger value="grid">Grade</TabsTrigger>
              <TabsTrigger value="map">Mapa</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <TabsContent value="grid" className="mt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="map" className="mt-0">
        <div className="h-[600px] rounded-lg border">
          <MissionMap missions={missions} />
        </div>
      </TabsContent>
    </div>
  )
}
