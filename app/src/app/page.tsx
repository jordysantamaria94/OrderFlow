import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="card bg-base-100 w-96 shadow">
          <div className="card-body">
            <div className="form-control mt-2">
              <h2 className="text-2xl font-bold mb-4">OverFlow</h2>
              <p className="text-lg mb-4">El mejor sistema para gestionar todas tus ordenes</p>
              <Link href="/auth/login" className="link link-primary text-lg font-semibold">Ingresar</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
