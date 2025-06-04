import { ScoreCard } from "@/views/pages/dashboard/ScoreCard"
import { Statistik } from '@/views/pages/dashboard/Statistik'

export const Dashboard = () => {
    return (
        <div className="flex gap-6 flex-col">
            <ScoreCard />
            <Statistik />
        </div>
    )
}