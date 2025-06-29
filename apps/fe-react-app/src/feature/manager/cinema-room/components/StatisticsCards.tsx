import { Building2, CheckCircle, Grid3X3, Wrench, XCircle } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/Shadcn/ui/card";

interface RoomStats {
  total: number;
  withSeatMap: number;
  active: number;
  maintenance: number;
  closed: number;
}

interface StatisticsCardsProps {
  stats: RoomStats;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  const cardData = [
    {
      title: "Total Rooms",
      value: stats.total,
      icon: Building2,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "from-blue-950/20 to-cyan-950/20",
      textColor: "text-blue-600 dark:text-blue-400",
      description: "Total cinema rooms",
    },
    {
      title: "With Seat Map",
      value: stats.withSeatMap,
      icon: Grid3X3,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      darkBgGradient: "from-emerald-950/20 to-teal-950/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      description: "Rooms with configured seating",
    },
    {
      title: "Active",
      value: stats.active,
      icon: CheckCircle,
      gradient: "from-green-500 to-lime-500",
      bgGradient: "from-green-50 to-lime-50",
      darkBgGradient: "from-green-950/20 to-lime-950/20",
      textColor: "text-green-600 dark:text-green-400",
      description: "Currently operational",
    },
    {
      title: "Maintenance",
      value: stats.maintenance,
      icon: Wrench,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
      darkBgGradient: "from-amber-950/20 to-orange-950/20",
      textColor: "text-amber-600 dark:text-amber-400",
      description: "Under maintenance",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Card
            key={index}
            className={`bg-gradient-to-br ${item.bgGradient} dark:${item.darkBgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group`}
          >
            <CardContent className="p-6 relative">
              {/* Background decoration */}
              <div
                className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />

              <div className="flex items-start justify-between relative">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm font-medium mb-1 tracking-wide">{item.title}</p>
                  <p className={`text-3xl font-bold ${item.textColor} mb-2 tracking-tight`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground/80">{item.description}</p>
                </div>

                <div
                  className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 w-full bg-white/50 dark:bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min((item.value / Math.max(stats.total, 1)) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Closed rooms card - special case */}
      {stats.closed > 0 && (
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
          <CardContent className="p-6 relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-red-500 to-rose-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" />

            <div className="flex items-start justify-between relative">
              <div className="flex-1">
                <p className="text-muted-foreground text-sm font-medium mb-1 tracking-wide">Closed</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2 tracking-tight">{stats.closed}</p>
                <p className="text-xs text-muted-foreground/80">Temporarily closed</p>
              </div>

              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <XCircle className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="mt-4 w-full bg-white/50 dark:bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.closed / Math.max(stats.total, 1)) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
