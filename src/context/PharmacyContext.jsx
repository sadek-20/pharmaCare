"use client"

import { createContext, useContext, useState } from "react"

const PharmacyContext = createContext()

export function PharmacyProvider({ children }) {
  // Medicines State
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      stock: 150,
      unitPrice: 2.5,
      sellingPrice: 5.0,
      expiryDate: "2026-12-31",
      supplier: "MedSupply Co.",
      batch: "BATCH001",
    },
    {
      id: 2,
      name: "Ibuprofen 400mg",
      category: "Anti-inflammatory",
      stock: 80,
      unitPrice: 3.0,
      sellingPrice: 6.5,
      expiryDate: "2026-08-15",
      supplier: "PharmaCorp",
      batch: "BATCH002",
    },
    {
      id: 3,
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      stock: 200,
      unitPrice: 4.5,
      sellingPrice: 9.0,
      expiryDate: "2025-11-30",
      supplier: "MedSupply Co.",
      batch: "BATCH003",
    },
  ])

  // Customers State
  const [customers, setCustomers] = useState([
    { id: 1, name: "John Doe", phone: "555-0101", email: "john@example.com", creditBalance: 125.5 },
    { id: 2, name: "Jane Smith", phone: "555-0102", email: "jane@example.com", creditBalance: 0 },
    { id: 3, name: "Bob Johnson", phone: "555-0103", email: "bob@example.com", creditBalance: 89.75 },
  ])

  // Suppliers State
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "MedSupply Co.", contact: "555-1001", email: "contact@medsupply.com", balance: 5000 },
    { id: 2, name: "PharmaCorp", contact: "555-1002", email: "info@pharmacorp.com", balance: 3200 },
    { id: 3, name: "HealthDistributors", contact: "555-1003", email: "sales@healthdist.com", balance: 0 },
  ])

  // Transactions State
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "sale",
      date: "2025-10-21T10:30:00",
      customer: "John Doe",
      amount: 125.5,
      paymentType: "cash",
      description: "Invoice #INV-001",
    },
    {
      id: 2,
      type: "purchase",
      date: "2025-10-20T14:20:00",
      supplier: "MedSupply Co.",
      amount: 2500,
      description: "Medicine Purchase - Paracetamol",
    },
    {
      id: 3,
      type: "payment",
      date: "2025-10-19T09:15:00",
      supplier: "PharmaCorp",
      amount: 1500,
      description: "Supplier Payment",
    },
  ])

  // Add Medicine
  const addMedicine = (medicine) => {
    setMedicines([...medicines, { ...medicine, id: Date.now() }])
  }

  // Update Medicine
  const updateMedicine = (id, updatedMedicine) => {
    setMedicines(medicines.map((m) => (m.id === id ? { ...updatedMedicine, id } : m)))
  }

  // Delete Medicine
  const deleteMedicine = (id) => {
    setMedicines(medicines.filter((m) => m.id !== id))
  }

  // Update Medicine Stock (after sale)
  const updateMedicineStock = (medicineName, quantity) => {
    setMedicines(medicines.map((m) => (m.name === medicineName ? { ...m, stock: m.stock - quantity } : m)))
  }

  // Add Customer
  const addCustomer = (customer) => {
    setCustomers([...customers, { ...customer, id: Date.now() }])
  }

  // Update Customer
  const updateCustomer = (id, updatedCustomer) => {
    setCustomers(customers.map((c) => (c.id === id ? { ...updatedCustomer, id } : c)))
  }

  // Delete Customer
  const deleteCustomer = (id) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  // Update Customer Credit Balance
  const updateCustomerCredit = (customerId, amount) => {
    setCustomers(customers.map((c) => (c.id === customerId ? { ...c, creditBalance: c.creditBalance + amount } : c)))
  }

  // Add Supplier
  const addSupplier = (supplier) => {
    setSuppliers([...suppliers, { ...supplier, id: Date.now() }])
  }

  // Update Supplier
  const updateSupplier = (id, updatedSupplier) => {
    setSuppliers(suppliers.map((s) => (s.id === id ? { ...updatedSupplier, id } : s)))
  }

  // Delete Supplier
  const deleteSupplier = (id) => {
    setSuppliers(suppliers.filter((s) => s.id !== id))
  }

  // Pay Supplier (clear or reduce balance)
  const paySupplier = (supplierId, amount) => {
    setSuppliers(suppliers.map((s) => (s.id === supplierId ? { ...s, balance: Math.max(0, s.balance - amount) } : s)))

    // Add transaction
    const supplier = suppliers.find((s) => s.id === supplierId)
    if (supplier) {
      addTransaction({
        type: "payment",
        date: new Date().toISOString(),
        supplier: supplier.name,
        amount,
        description: `Payment to ${supplier.name}`,
      })
    }
  }

  // Add Transaction
  const addTransaction = (transaction) => {
    setTransactions([{ ...transaction, id: Date.now() }, ...transactions])
  }

  // Create Sale (Invoice)
  const createSale = (saleData) => {
    const { customer, items, total, paymentType, amountPaid } = saleData

    // Update medicine stock
    items.forEach((item) => {
      updateMedicineStock(item.medicineName, Number.parseInt(item.quantity))
    })

    // Update customer credit if payment is credit or partial
    if (paymentType === "credit") {
      const customerObj = customers.find((c) => c.name === customer.name)
      if (customerObj) {
        updateCustomerCredit(customerObj.id, total)
      }
    } else if (paymentType === "cash" && amountPaid < total) {
      const customerObj = customers.find((c) => c.name === customer.name)
      if (customerObj) {
        updateCustomerCredit(customerObj.id, total - amountPaid)
      }
    }

    // Add transaction
    addTransaction({
      type: "sale",
      date: new Date().toISOString(),
      customer: customer.name,
      amount: total,
      paymentType,
      description: `Invoice - ${items.length} items`,
    })
  }

  const value = {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    updateMedicineStock,
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    updateCustomerCredit,
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    paySupplier,
    transactions,
    addTransaction,
    createSale,
  }

  return <PharmacyContext.Provider value={value}>{children}</PharmacyContext.Provider>
}

export function usePharmacy() {
  const context = useContext(PharmacyContext)
  if (!context) {
    throw new Error("usePharmacy must be used within PharmacyProvider")
  }
  return context
}
