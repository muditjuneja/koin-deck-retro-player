import React from 'react';
import GameDashboard from '@/app/components/GameDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Web OS Demo | koin.js',
    description: 'A comprehensive example showing how to build a complete game dashboard with custom UI integration.',
};

export default function DashboardExamplePage() {
    return (
        <div className="space-y-8 w-full">
            <GameDashboard />
        </div>
    );
}
