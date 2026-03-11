import { Link } from "react-router-dom";
import { BookOpen, Users, ArrowRight } from "lucide-react";
import { useCursos } from "@/hooks/useCursos";
import { useUsuarios } from "@/hooks/useUsuarios";

const cards = [
  {
    to: "/cursos",
    label: "Cursos",
    description: "Gestiona los cursos disponibles",
    icon: BookOpen,
    accentBg: "bg-blue-100",
    accentIcon: "text-blue-600",
    accentBorder: "hover:border-blue-300",
    useHook: useCursos,
    unit: "curso",
  },
  {
    to: "/alumnos",
    label: "Alumnos",
    description: "Gestiona los alumnos registrados",
    icon: Users,
    accentBg: "bg-violet-100",
    accentIcon: "text-violet-600",
    accentBorder: "hover:border-violet-300",
    useHook: useUsuarios,
    unit: "alumno",
  },
];

function StatCard({ card, index }) {
  const { data, isLoading } = card.useHook();
  const count = data?.length ?? 0;
  const Icon = card.icon;

  return (
    <Link
      to={card.to}
      className={`animate-fade-in-up group flex items-center gap-5 rounded-xl border bg-card p-6 shadow-sm
        transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${card.accentBorder}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${card.accentBg} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`h-7 w-7 ${card.accentIcon}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-lg leading-tight">{card.label}</p>
        <p className="text-sm text-muted-foreground">{card.description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {isLoading ? (
            <span className="inline-block h-3 w-16 bg-muted rounded animate-pulse" />
          ) : (
            <span className="font-medium text-foreground">
              {count} {card.unit}{count !== 1 ? "s" : ""}
            </span>
          )}{" "}
          registrado{count !== 1 ? "s" : ""}
        </p>
      </div>

      <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido al sistema de gestión de cursos y alumnos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card, i) => (
          <StatCard key={card.to} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}
