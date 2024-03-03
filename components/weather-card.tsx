interface WeatherCardProps {
  info: {
    city: string;
    temperature: number;
    high: number;
    low: number;
    weatherType: string;
  };
}

export default function WeatherCard({ info }: WeatherCardProps) {
  return (
    <div className="flex flex-col justify-between w-64 h-64 rounded-2xl p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-primary-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg">{info.city}</h1>
          <p className="text-6xl">{info.temperature}°</p>
        </div>
      </div>
      <div className="flex flex-col">
        <SunIcon className="text-yellow-300 text-2xl" />
        <span className="text-sm">{info.weatherType}</span>
        <div className="text-sm">
          <span>H:{info.high}° </span>
          <span>L:{info.low}°</span>
        </div>
      </div>
    </div>
  );
}
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
