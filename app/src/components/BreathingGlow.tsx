export function BreathingGlow() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 rounded-full bg-[#7FA5B8] opacity-20 animate-[pulse_3s_ease-in-out_infinite]" />
      <div className="absolute inset-4 rounded-full bg-[#7FA5B8] opacity-30 animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
      <div className="absolute inset-8 rounded-full bg-[#7FA5B8] opacity-50 animate-[pulse_3s_ease-in-out_infinite_1s]" />
    </div>
  );
}
