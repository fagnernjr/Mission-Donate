import { MissionaryList } from '@/components/missionaries/MissionaryList'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600 // revalidate every hour

export default async function MissionariesPage() {
  const supabase = createClient()

  const { data: missionaries } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      avatar_url,
      bio,
      location,
      role,
      campaigns (
        id,
        title,
        status
      )
    `)
    .eq('role', 'missionary')
    .order('full_name')

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Missionários</h1>
          <p className="text-muted-foreground">
            Conheça os missionários que estão fazendo a diferença ao redor do mundo.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {missionaries?.map((missionary) => (
            <MissionaryList key={missionary.id} missionary={missionary} />
          ))}
        </div>
      </div>
    </div>
  )
}
