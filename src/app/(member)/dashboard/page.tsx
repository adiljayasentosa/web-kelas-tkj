/**
 * Widget di sini masih placeholder statis — mengambil data sungguhan
 * (pengumuman, jadwal, piket, saldo kas) adalah pekerjaan tahap
 * Development fitur berikutnya, mengikuti struktur di
 * features/{pengumuman,jadwal,piket,kas}/services.
 * Layout widget mengikuti ui-ux-planning-website-kelas-v1.0.md §4.
 */
export default function MemberDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardWidget title="Pengumuman Terbaru" value="—" />
        <DashboardWidget title="Jadwal Hari Ini" value="—" />
        <DashboardWidget title="Status Piket" value="—" />
        <DashboardWidget title="Saldo Kas" value="—" />
      </div>
    </div>
  );
}

function DashboardWidget({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground text-xs">{title}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
