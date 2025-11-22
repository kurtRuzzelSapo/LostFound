import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Download,
    Filter,
    Search,
    FileText,
    Users,
    MapPin,
    BarChart3,
} from "lucide-react";
import { supabase } from "@/supabase-client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface FoundItem {
    id: string;
    title: string;
    description: string;
    location: string;
    date_found: string;
    image_url: string;
    is_claimed: boolean;
    claimed_by?: string;
    created_at: string;
    user_id: string;
}

interface LostItem {
    id: string;
    title: string;
    description: string;
    location: string;
    date_lost: string;
    image_url: string;
    is_claimed: boolean;
    created_at: string;
    user_id: string;
}

interface ReportFilters {
    tableType: 'all' | 'found' | 'lost';
    status: 'all' | 'claimed' | 'unclaimed';
    location: string;
    userId: string;
    dateFrom: string;
    dateTo: string;
}

const AdminReportsPage = () => {
    const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
    const [lostItems, setLostItems] = useState<LostItem[]>([]);
    const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState<ReportFilters>({
        tableType: 'all',
        status: 'all',
        location: '',
        userId: '',
        dateFrom: '',
        dateTo: '',
    });

    // Fetch data from Supabase
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch found items
            const { data: foundData, error: foundError } = await supabase
                .from('found-item')
                .select('*')
                .order('created_at', { ascending: false });

            if (foundError) throw foundError;

            // Fetch lost items
            const { data: lostData, error: lostError } = await supabase
                .from('lost-items')
                .select('*')
                .order('created_at', { ascending: false });

            if (lostError) throw lostError;

            // Fetch users (you might need to adjust this based on your auth setup)
            const { data: usersData, error: usersError } = await supabase
                .from('user_profiles') // or your users table
                .select('id, email')
                .limit(100);

            if (usersError) console.error('Error fetching users:', usersError);

            setFoundItems(foundData || []);
            setLostItems(lostData || []);
            setUsers(usersData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters and search
    const getFilteredItems = () => {
        let items: any[] = [];

        // Combine items with their types
        if (filters.tableType === 'all' || filters.tableType === 'found') {
            items = [...items, ...foundItems.map(item => ({ ...item, type: 'found' }))];
        }

        if (filters.tableType === 'all' || filters.tableType === 'lost') {
            items = [...items, ...lostItems.map(item => ({ ...item, type: 'lost' }))];
        }

        // Apply status filter
        if (filters.status !== 'all') {
            const isClaimed = filters.status === 'claimed';
            items = items.filter(item => item.is_claimed === isClaimed);
        }

        // Apply location filter
        if (filters.location) {
            items = items.filter(item =>
                item.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Apply user filter
        if (filters.userId) {
            items = items.filter(item => item.user_id === filters.userId);
        }

        // Apply date range filter
        if (filters.dateFrom) {
            items = items.filter(item => {
                const itemDate = new Date(item.type === 'found' ? item.date_found : item.date_lost);
                const fromDate = new Date(filters.dateFrom);
                return itemDate >= fromDate;
            });
        }

        if (filters.dateTo) {
            items = items.filter(item => {
                const itemDate = new Date(item.type === 'found' ? item.date_found : item.date_lost);
                const toDate = new Date(filters.dateTo);
                toDate.setHours(23, 59, 59, 999); // End of the day
                return itemDate <= toDate;
            });
        }

        // Apply search term
        if (searchTerm) {
            items = items.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return items;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusText = (item: any) => {
        if (item.type === 'found') {
            return item.is_claimed ? "Claimed" : "Unclaimed";
        } else {
            return item.is_claimed ? "Found" : "Lost";
        }
    };

    const getStatusColor = (item: any) => {
        if (item.type === 'found') {
            return item.is_claimed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
        } else {
            return item.is_claimed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
        }
    };

    const generatePDFReport = async () => {
        setGeneratingPDF(true);
        try {
            const doc = new jsPDF();
            const filteredItems = getFilteredItems();

            // Title
            doc.setFontSize(20);
            doc.text('Lost & Found Items Report', 14, 22);

            // Report details
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
            doc.text(`Total Items: ${filteredItems.length}`, 14, 38);

            // Filters applied
            let filterText = 'Filters: ';
            const activeFilters = [];
            if (filters.tableType !== 'all') activeFilters.push(`Type: ${filters.tableType}`);
            if (filters.status !== 'all') activeFilters.push(`Status: ${filters.status}`);
            if (filters.location) activeFilters.push(`Location: ${filters.location}`);
            if (filters.userId) activeFilters.push(`User: ${users.find(u => u.id === filters.userId)?.email || filters.userId}`);
            if (filters.dateFrom || filters.dateTo) {
                activeFilters.push(`Date Range: ${filters.dateFrom || 'Any'} to ${filters.dateTo || 'Any'}`);
            }

            filterText += activeFilters.length > 0 ? activeFilters.join(', ') : 'None';

            doc.text(filterText, 14, 44);

            // Prepare table data
            const tableData = filteredItems.map(item => [
                item.type === 'found' ? 'Found' : 'Lost',
                item.title,
                item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description,
                item.location,
                formatDate(item.type === 'found' ? item.date_found : item.date_lost),
                getStatusText(item),
                item.is_claimed && item.type === 'found' ? (item.claimed_by || 'N/A') : 'N/A'
            ]);

            // Add table
            autoTable(doc, {
                startY: 50,
                head: [['Type', 'Title', 'Description', 'Location', 'Date', 'Status', 'Claimed By']],
                body: tableData,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [59, 130, 246] },
                alternateRowStyles: { fillColor: [249, 250, 251] },
            });

            // Statistics section
            const finalY = (doc as any).lastAutoTable.finalY + 10;
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text('Summary Statistics', 14, finalY);

            const foundCount = filteredItems.filter(item => item.type === 'found').length;
            const lostCount = filteredItems.filter(item => item.type === 'lost').length;
            const claimedCount = filteredItems.filter(item => item.is_claimed).length;
            const unclaimedCount = filteredItems.length - claimedCount;

            doc.setFontSize(10);
            doc.text(`Found Items: ${foundCount}`, 14, finalY + 10);
            doc.text(`Lost Items: ${lostCount}`, 14, finalY + 16);
            doc.text(`Claimed/Found: ${claimedCount}`, 14, finalY + 22);
            doc.text(`Unclaimed/Lost: ${unclaimedCount}`, 14, finalY + 28);

            // Save the PDF
            doc.save(`lost-found-report-${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setGeneratingPDF(false);
        }
    };

    const getStats = () => {
        const filteredItems = getFilteredItems();
        const foundCount = filteredItems.filter(item => item.type === 'found').length;
        const lostCount = filteredItems.filter(item => item.type === 'lost').length;
        const claimedCount = filteredItems.filter(item => item.is_claimed).length;
        const unclaimedCount = filteredItems.length - claimedCount;

        return { foundCount, lostCount, claimedCount, unclaimedCount, total: filteredItems.length };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Loading report data...</p>
                </div>
            </div>
        );
    }

    const filteredItems = getFilteredItems();

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Reports</h1>
                    <p className="text-gray-600 mt-2">Generate comprehensive reports for lost and found items</p>
                </div>

                <Button
                    onClick={generatePDFReport}
                    disabled={generatingPDF || filteredItems.length === 0}
                    className="flex items-center gap-2"
                >
                    {generatingPDF ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {generatingPDF ? 'Generating PDF...' : 'Export PDF Report'}
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            Found: {stats.foundCount} • Lost: {stats.lostCount}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Claimed/Found</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.claimedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total > 0 ? Math.round((stats.claimedCount / stats.total) * 100) : 0}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.unclaimedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Unclaimed items and lost items
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Users Involved</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Total users in system
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Report Filters
                    </CardTitle>
                    <CardDescription>
                        Filter items to generate specific reports
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Table Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Item Type</label>
                            <Select
                                value={filters.tableType}
                                onValueChange={(value: 'all' | 'found' | 'lost') =>
                                    setFilters(prev => ({ ...prev, tableType: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Items</SelectItem>
                                    <SelectItem value="found">Found Items</SelectItem>
                                    <SelectItem value="lost">Lost Items</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={filters.status}
                                onValueChange={(value: 'all' | 'claimed' | 'unclaimed') =>
                                    setFilters(prev => ({ ...prev, status: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="claimed">Claimed/Found</SelectItem>
                                    <SelectItem value="unclaimed">Unclaimed/Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* User Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">User</label>
                            <Select
                                value={filters.userId}
                                onValueChange={(value: string) =>
                                    setFilters(prev => ({ ...prev, userId: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-users">All Users</SelectItem>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input
                                placeholder="Filter by location..."
                                value={filters.location}
                                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Date Range Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date From</label>
                            <Input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date To</label>
                            <Input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Search */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search in titles, descriptions, locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Report Results</CardTitle>
                    <CardDescription>
                        Showing {filteredItems.length} items matching your filters
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No items match your current filters
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Claimed By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item) => (
                                        <TableRow key={`${item.type}-${item.id}`}>
                                            <TableCell>
                                                <Badge variant={item.type === 'found' ? 'default' : 'secondary'}>
                                                    {item.type === 'found' ? 'Found' : 'Lost'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {item.description}
                                            </TableCell>
                                            <TableCell>{item.location}</TableCell>
                                            <TableCell>
                                                {formatDate(item.type === 'found' ? item.date_found : item.date_lost)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(item)}>
                                                    {getStatusText(item)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {/* {item.type === 'Found' ? (item.claimed_by || 'Unknown') : 'N/A'} */}
                                                {item.claimed_by ? item.claimed_by : 'Not yet Claim'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminReportsPage;