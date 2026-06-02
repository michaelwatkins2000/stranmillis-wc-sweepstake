// ============================================================
// POST-IT BOARD — PHASE 2 (not yet implemented)
// ============================================================
// This component requires Supabase for persistence.
// When ready to implement:
//
// 1. Create a Supabase project at https://supabase.com
// 2. Run this SQL in the Supabase editor:
//
//    create table challenges (
//      id uuid default gen_random_uuid() primary key,
//      author text not null,
//      message text not null,
//      accepted_by text,
//      response text,
//      created_at timestamptz default now()
//    );
//    alter table challenges enable row level security;
//    create policy "Public read" on challenges for select using (true);
//    create policy "Public insert" on challenges for insert with check (true);
//    create policy "Public update" on challenges for update using (true);
//
// 3. Add a .env file at the project root:
//    VITE_SUPABASE_URL=https://xxxx.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key
//
// 4. Install the client: npm install @supabase/supabase-js
//
// 5. Replace this stub with the full implementation
// ============================================================

export function PostItBoard() {
  return (
    <div className="tab-content">
      <div className="coming-soon">
        <div className="coming-soon__icon">📌</div>
        <h2 className="coming-soon__title">Challenge Board</h2>
        <p className="coming-soon__text">
          Coming soon — post challenges to your friends and see who accepts!
        </p>
      </div>
    </div>
  )
}
