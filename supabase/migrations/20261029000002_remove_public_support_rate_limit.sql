drop function if exists public.record_public_support(text);
drop table if exists public.public_support_rate_limits;

create or replace function public.record_public_support()
returns table (gems_count bigint)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_gems_count bigint;
begin
  update public.site_content as content
  set gems_count = content.gems_count + 1,
      updated_at = now()
  where content.id = 1
    and content.gems_count < 9007199254740991
  returning content.gems_count into v_gems_count;

  if not found then
    raise exception 'Support counter is missing or has reached its maximum value.';
  end if;

  return query select v_gems_count;
end;
$function$;

revoke all on function public.record_public_support() from public, anon, authenticated;
grant execute on function public.record_public_support() to service_role;
