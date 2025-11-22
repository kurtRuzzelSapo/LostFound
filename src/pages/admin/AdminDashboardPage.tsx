import LostFoundTable from "@/components/lost-found-table"

const AdminDashboardPage = () => {
    return (
        <div className="p-6">
            <h1>All Lost & Found Items</h1>
            
            <LostFoundTable />
        </div>
    )
}

export default AdminDashboardPage