const stats = [
  { value: "2.800+", label: "Editor terverifikasi" },
  { value: "45.000+", label: "Video selesai" },
  { value: "98%", label: "Tingkat kepuasan" },
  { value: "< 1 jam", label: "Rata-rata respon" },
];

export default function Stats() {
  return (
    <section className="mt-[28px]">
      <div className="grid grid-cols-2 gap-x-[14px] gap-y-[18px] sm:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="relative flex flex-col items-center text-center p-[20px] rounded-[16px] bg-chip border border-[#20202B]"
          >
            <div className="font-display text-[28px] font-bold leading-[34px] text-white sm:text-[36px]">
              {stat.value}
            </div>
            <p className="mt-[6px] text-[11.5px] leading-[14px] text-muted">
              {stat.label}
            </p>

            {index < stats.length - 1 && (
              <div className="hidden sm:block absolute top-1/2 right-[-7px] h-[60px] w-[1px] bg-gradient-to-b from-transparent via-line to-transparent -translate-y-1/2" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}