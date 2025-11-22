import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin, Calendar, Trash2, BarChart3, ChevronDown, ChevronUp, User, AlertTriangle } from "lucide-react";
import { supabase } from "@/supabase-client";
import toast from "react-hot-toast";

// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

type ItemType = 'all' | 'found' | 'lost';

const LostFoundTable = () => {
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ItemType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGraphs, setShowGraphs] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedClaimItem, setSelectedClaimItem] = useState<FoundItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string; type: 'found' | 'lost'; title: string} | null>(null);

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

      setFoundItems(foundData || []);
      setLostItems(lostData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  // Delete item function with modal
  const openDeleteModal = (itemId: string, type: 'found' | 'lost', title: string) => {
    setItemToDelete({ id: itemId, type, title });
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const deleteItem = async () => {
    if (!itemToDelete) return;

    try {
      const tableName = itemToDelete.type === 'found' ? 'found-item' : 'lost-item';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      // Update local state
      if (itemToDelete.type === 'found') {
        setFoundItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      } else {
        setLostItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      }

      toast.success('Item deleted successfully');
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  // Claim info modal
  const openClaimModal = (item: FoundItem) => {
    setSelectedClaimItem(item);
    setShowClaimModal(true);
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
    setSelectedClaimItem(null);
  };

  // Filter and search items
  const filteredItems = () => {
    let items: any[] = [];

    if (filter === 'all' || filter === 'found') {
      items = [...items, ...foundItems.map(item => ({ ...item, type: 'found' }))];
    }
    
    if (filter === 'all' || filter === 'lost') {
      items = [...items, ...lostItems.map(item => ({ ...item, type: 'lost' }))];
    }

    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  };

  // Chart data calculations
  const chartData = {
    // Bar chart: Items per month
    monthlyData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Found Items',
          data: Array(12).fill(0).map((_, index) => 
            foundItems.filter(item => new Date(item.created_at).getMonth() === index).length
          ),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
        },
        {
          label: 'Lost Items',
          data: Array(12).fill(0).map((_, index) => 
            lostItems.filter(item => new Date(item.created_at).getMonth() === index).length
          ),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
        },
      ],
    },
    
    // Doughnut chart: Status distribution
    statusData: {
      labels: ['Found Unclaimed', 'Found Claimed', 'Lost Active', 'Lost Found'],
      datasets: [
        {
          data: [
            foundItems.filter(item => !item.is_claimed).length,
            foundItems.filter(item => item.is_claimed).length,
            lostItems.filter(item => !item.is_claimed).length,
            lostItems.filter(item => item.is_claimed).length,
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
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
      return item.is_claimed ? "Claimed" : "Not Claimed";
    } else {
      return item.is_claimed ? "found" : "Lost";
    }
  };



  const getStatusBadgeColor = (item: any) => {
    if (item.type === 'found') {
      return item.is_claimed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    } else {
      return item.is_claimed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.div 
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Loading items...</p>
        </div>
      </motion.div>
    );
  }

  const displayedItems = filteredItems();

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with Stats and Toggle */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Lost & Found Management
          </motion.h1>
          <motion.div 
            className="flex gap-4 mt-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span 
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Found: {foundItems.length}
            </motion.span>
            <motion.span 
              className="bg-red-100 text-red-800 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Lost: {lostItems.length}
            </motion.span>
            <motion.span 
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Total: {foundItems.length + lostItems.length}
            </motion.span>
          </motion.div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={() => setShowGraphs(!showGraphs)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <motion.div
              animate={{ rotate: showGraphs ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showGraphs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.div>
            {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
          </Button>
        </motion.div>
      </motion.div>

      {/* Animated Charts Section */}
      <AnimatePresence>
        {showGraphs && (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-white p-4 rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
            >
              <h3 className="text-lg font-semibold mb-4">Items Per Month</h3>
              <div className="h-80">
                <Bar 
                  data={chartData.monthlyData} 
                  options={chartOptions}
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-4 rounded-lg border shadow-sm"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
            >
              <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
              <div className="h-80">
                <Doughnut 
                  data={chartData.statusData} 
                  options={chartOptions}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as ItemType)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Items</option>
              <option value="found">Found Items</option>
              <option value="lost">Lost Items</option>
            </select>
          </motion.div>

          <motion.div 
            className="relative w-full sm:w-[300px]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </motion.div>
        </div>

        <motion.div 
          className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
          whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
          transition={{ duration: 0.2 }}
        >
          Showing {displayedItems.length} items
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div 
        className="border rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Type</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {displayedItems.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {foundItems.length === 0 && lostItems.length === 0 
                      ? "No items in database" 
                      : "No items match your search"
                    }
                  </TableCell>
                </motion.tr>
              ) : (
                displayedItems.map((item, index) => (
                  <motion.tr 
                    key={`${item.type}-${item.id}`} 
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      backgroundColor: "rgba(243, 244, 246, 1)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <TableCell>
                      <motion.span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'found' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.type === 'found' ? 'Found' : 'Lost'}
                      </motion.span>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {item.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(item.type === 'found' ? item.date_found : item.date_lost)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <motion.button
                        onClick={() =>  item.is_claimed && openClaimModal(item)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item)} ${
                           item.is_claimed ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-default'
                        }`}
                        whileHover={ item.is_claimed ? { scale: 1.05 } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        { item.is_claimed && (
                          <User className="w-3 h-3 mr-1" />
                        )}
                        {getStatusText(item)}
                      </motion.button>
                    </TableCell>
                    <TableCell>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(item.id, item.type, item.title)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {/* Claim Info Modal */}
      <AnimatePresence>
        {showClaimModal && selectedClaimItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeClaimModal}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <User className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Item Claimed</h3>
                  <p className="text-sm text-gray-600">Claim information for {selectedClaimItem.title}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Claimed By:</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                    {selectedClaimItem.claimed_by || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Item:</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                    {selectedClaimItem.title}
                  </p>
                </div>
                {/* <div>
                  <label className="text-sm font-medium text-gray-700">Date Found:</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                    {selectedClaimItem.date_found}
                  </p>
                </div> */}
              </div>

              <Button
                onClick={closeClaimModal}
                className="w-full"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && itemToDelete && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDeleteModal}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>"{itemToDelete.title}"</strong>?
              </p>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteItem}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LostFoundTable;