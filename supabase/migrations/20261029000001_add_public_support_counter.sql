create table if not exists public.public_support_rate_limits (
  client_hash text primary key check (client_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  request_count smallint not null check (request_count between 1 and 6)
);

create index if not exists public_support_rate_limits_window_started_at_idx
  on public.public_support_rate_limits (window_started_at);

alter table public.public_support_rate_limits enable row level security;
revoke all on table public.public_support_rate_limits from anon, authenticated;
grant all on table public.public_support_rate_limits to service_role;

create or replace function public.record_public_support(p_client_hash text)
returns table (gems_count bigint, rate_limited boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_request_count smallint;
  v_gems_count bigint;
begin
  if p_client_hash is null or p_client_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid support client identifier.';
  end if;

  delete from public.public_support_rate_limits
  where window_started_at < v_now - interval '24 hours';

  insert into public.public_support_rate_limits (client_hash, window_started_at, request_count)
  values (p_client_hash, v_now, 1)
  on conflict (client_hash) do update
  set
    window_started_at = case
      when public.public_support_rate_limits.window_started_at <= v_now - interval '1 minute'
        then v_now
      else public.public_support_rate_limits.window_started_at
    end,
    request_count = case
      when public.public_support_rate_limits.window_started_at <= v_now - interval '1 minute'
        then 1
      else least(public.public_support_rate_limits.request_count + 1, 6)::smallint
    end
  returning request_count into v_request_count;

  if v_request_count > 5 then
    select content.gems_count into v_gems_count
    from public.site_content as content
    where content.id = 1;
    return query select v_gems_count, true;
    return;
  end if;

  update public.site_content as content
  set gems_count = content.gems_count + 1,
      updated_at = v_now
  where content.id = 1
    and content.gems_count < 9007199254740991
  returning content.gems_count into v_gems_count;

  if not found then
    raise exception 'Support counter limit reached.';
  end if;

  return query select v_gems_count, false;
end;
$$;

revoke all on function public.record_public_support(text) from public, anon, authenticated;
grant execute on function public.record_public_support(text) to service_role;
