import { ScoreCard } from "@/views/pages/user/dashboard/ScoreCard"
import { ProductTable } from '@/views/pages/user/dashboard/ProductTable'

export const Dashboard = () => {
    return (
        <div className="flex gap-6 flex-col">
            <ScoreCard />
            <ProductTable />
        </div>
    )
}