-- Banco do roadmap: uma linha por pessoa, com o progresso inteiro em JSON.
-- Cole este arquivo no SQL Editor do Supabase e rode uma vez.

create table if not exists public.roadmap_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- mantém updated_at sempre correto (a nuvem é quem carimba a hora)
create or replace function public.roadmap_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists roadmap_progress_touch on public.roadmap_progress;
create trigger roadmap_progress_touch
before update on public.roadmap_progress
for each row execute function public.roadmap_touch_updated_at();

-- cada pessoa só enxerga e altera a própria linha
alter table public.roadmap_progress enable row level security;

drop policy if exists "ler o proprio progresso" on public.roadmap_progress;
create policy "ler o proprio progresso" on public.roadmap_progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "criar o proprio progresso" on public.roadmap_progress;
create policy "criar o proprio progresso" on public.roadmap_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "atualizar o proprio progresso" on public.roadmap_progress;
create policy "atualizar o proprio progresso" on public.roadmap_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "apagar o proprio progresso" on public.roadmap_progress;
create policy "apagar o proprio progresso" on public.roadmap_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- visitantes sem login não têm acesso nenhum
revoke all on public.roadmap_progress from anon;
