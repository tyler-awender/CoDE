"use client";

import React from "react";

type DataPoint = {
    date: string;
    games: number;
};

type LineChartProps = {
    data: DataPoint[];
};

export default function LineChart({ data }: LineChartProps) {
    const width = 800;
    const height = 180;
    const padding = 20;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    };

    if (!data || data.length === 0) return null;

    const values = data.map(d => d.games);
    const max = Math.max(...values);
    const min = Math.min(...values);

    const getX = (i: number): number =>
        padding + (i / (data.length - 1)) * (width - padding * 2);

    const getY = (value: number): number =>
        height -
        padding -
        ((value - min) / (max - min || 1)) * (height - padding * 2);

    const path = data
        .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.games)}`)
        .join(" ");

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
            />

            {data.map((d, i) => {
                const x = getX(i);
                const y = getY(d.games);

                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r={3} fill="currentColor" />

                        <text
                            x={x}
                            y={y - 8}
                            textAnchor="middle"
                            fontSize="10"
                            fill="currentColor"
                        >
                            {d.games}
                        </text>
                    </g>
                );
            })}

            {data.map((d, i) => {
                const x = getX(i);

                return (
                    <text
                        key={i}
                        x={x}
                        y={height - 5}
                        textAnchor="middle"
                        fontSize="10"
                        fill="currentColor"
                    >
                        {formatDate(d.date)}
                    </text>
                );
            })}
        </svg>
    );
}