import { Icon } from "@iconify/react";
import React from "react";

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stats shadow-lg bg-base-100 rounded-box border border-base-300">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Icon icon="material-symbols:meeting-room" className="h-8 w-8" />
          </div>
          <div className="stat-title text-base-content/70">Total Rooms</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
      </div>

      <div className="stats shadow-lg bg-base-100 rounded-box border border-base-300">
        <div className="stat">
          <div className="stat-figure text-success">
            <Icon icon="material-symbols:grid-view" className="h-8 w-8" />
          </div>
          <div className="stat-title text-base-content/70">With Seat Map</div>
          <div className="stat-value text-success">{stats.withSeatMap}</div>
        </div>
      </div>

      <div className="stats shadow-lg bg-base-100 rounded-box border border-base-300">
        <div className="stat">
          <div className="stat-figure text-accent">
            <Icon icon="material-symbols:check-circle" className="h-8 w-8" />
          </div>
          <div className="stat-title text-base-content/70">Active</div>
          <div className="stat-value text-accent">{stats.active}</div>
        </div>
      </div>

      <div className="stats shadow-lg bg-base-100 rounded-box border border-base-300">
        <div className="stat">
          <div className="stat-figure text-warning">
            <Icon icon="material-symbols:build" className="h-8 w-8" />
          </div>
          <div className="stat-title text-base-content/70">Maintenance</div>
          <div className="stat-value text-warning">{stats.maintenance}</div>
        </div>
      </div>
    </div>
  );
};
