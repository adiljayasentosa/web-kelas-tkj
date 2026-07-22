export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Dashboard Admin</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardWidget title="Saldo Kas" value="—" />
        <DashboardWidget title="Pengumuman Terbaru" value="—" />
        <DashboardWidget title="Jumlah Anggota" value="—" />
        <DashboardWidget title="Aksi Cepat" value="—" />
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
