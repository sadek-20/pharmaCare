import { Pill, DollarSign, AlertTriangle, Calendar, TrendingUp, Users, Building2 } from "../components/Icons"
import { usePharmacy } from "../context/PharmacyContext"

function Dashboard() {
  const { medicines, transactions, customers, suppliers } = usePharmacy()

  const totalMedicines = medicines.length
  const lowStockItems = medicines.filter((m) => m.stock < 50).length
  const nearExpiryItems = medicines.filter((m) => {
    const expiryDate = new Date(m.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 90 && daysUntilExpiry >= 0
  }).length

  const todaysSales = transactions
    .filter((t) => {
      const transactionDate = new Date(t.date).toDateString()
      const today = new Date().toDateString()
      return t.type === "sale" && transactionDate === today
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const stats = [
    { label: "Total Medicines", value: totalMedicines, icon: Pill, color: "bg-blue-500" },
    { label: "Today's Sales", value: `$${todaysSales.toFixed(2)}`, icon: DollarSign, color: "bg-green-500" },
    { label: "Low Stock Items", value: lowStockItems, icon: AlertTriangle, color: "bg-yellow-500" },
    { label: "Near Expiry", value: nearExpiryItems, icon: Calendar, color: "bg-red-500" },
  ]

  const recentSales = transactions
    .filter((t) => t.type === "sale")
    .slice(0, 5)
    .map((t) => ({
      id: `INV-${t.id}`,
      customer: t.customer,
      amount: `$${t.amount.toFixed(2)}`,
      date: new Date(t.date).toLocaleDateString(),
    }))

  const lowStockMedicines = medicines
    .filter((m) => m.stock < 50)
    .slice(0, 5)
    .map((m) => ({
      name: m.name,
      stock: m.stock,
      minStock: 50,
    }))

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-xl">
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's your pharmacy overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-16 h-16 rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Customer Overview</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Total Customers</span>
              <span className="text-2xl font-bold text-gray-900">{customers.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
              <span className="text-gray-700 font-medium">Total Credit</span>
              <span className="text-2xl font-bold text-red-600">
                ${customers.reduce((sum, c) => sum + c.creditBalance, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Supplier Overview</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Total Suppliers</span>
              <span className="text-2xl font-bold text-gray-900">{suppliers.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
              <span className="text-gray-700 font-medium">Outstanding Balance</span>
              <span className="text-2xl font-bold text-red-600">
                ${suppliers.reduce((sum, s) => sum + s.balance, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Sales</h3>
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{sale.id}</p>
                    <p className="text-sm text-gray-600 mt-1">{sale.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">{sale.amount}</p>
                    <p className="text-xs text-gray-500 mt-1">{sale.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No sales yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Low Stock Alert</h3>
          <div className="space-y-3">
            {lowStockMedicines.length > 0 ? (
              lowStockMedicines.map((medicine, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-900">{medicine.name}</p>
                    <span className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                      {medicine.stock} units
                    </span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${(medicine.stock / medicine.minStock) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">All medicines are well stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
